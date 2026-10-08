import os
import subprocess
import tarfile
import time

workspace_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
archive_path = os.path.join(workspace_root, 'deploy_output.tar.gz')
public_dir = os.path.join(workspace_root, '.output', 'public')
nginx_conf = os.path.join(workspace_root, 'deploy', 'nginx-aaa.is-a.dev.conf')


def run_with_retry(cmd, max_retries=3, delay=2):
    for attempt in range(1, max_retries + 1):
        res = subprocess.run(cmd, capture_output=True, text=True)
        if res.returncode == 0:
            return res
        print(f"Attempt {attempt}/{max_retries} failed (code {res.returncode}): {res.stderr.strip()}")
        if attempt < max_retries:
            time.sleep(delay)
    return res


print('1. Creating tar.gz archive...')
with tarfile.open(archive_path, 'w:gz') as tar:
    tar.add(public_dir, arcname='.')
print(f'Archive size: {os.path.getsize(archive_path)} bytes')

print('2. Uploading static bundle to getsaldo...')
res_scp_bundle = run_with_retry(['scp', archive_path, 'getsaldo:/tmp/deploy_output.tar.gz'])
print('SCP bundle returncode:', res_scp_bundle.returncode)
if res_scp_bundle.returncode != 0:
    raise RuntimeError(f"SCP bundle failed: {res_scp_bundle.stderr}")

print('3. Uploading Nginx configuration...')
res_scp_nginx = run_with_retry(['scp', nginx_conf, 'getsaldo:/etc/nginx/sites-available/aaa.is-a.dev'])
print('SCP nginx returncode:', res_scp_nginx.returncode)
if res_scp_nginx.returncode != 0:
    raise RuntimeError(f"SCP nginx failed: {res_scp_nginx.stderr}")

print('4. Executing remote deployment commands on getsaldo...')
remote_cmds = (
    'tar -xzf /tmp/deploy_output.tar.gz -C /var/www/aaa && '
    'rm -f /tmp/deploy_output.tar.gz && '
    'find /var/www/aaa -type f \\( -name "*.html" -o -name "*.css" -o -name "*.js" -o -name "*.xml" \\) -exec gzip -k -9 -f {} + && '
    'chown -R www-data:www-data /var/www/aaa && '
    'chmod -R u=rwX,go=rX /var/www/aaa && '
    'nginx -t && systemctl reload nginx'
)

res_ssh = run_with_retry(['ssh', '-o', 'BatchMode=yes', 'getsaldo', remote_cmds])
print('SSH returncode:', res_ssh.returncode)
print('SSH stdout:', res_ssh.stdout)
if res_ssh.stderr:
    print('SSH stderr:', res_ssh.stderr)
if res_ssh.returncode != 0:
    raise RuntimeError(f"SSH execution failed: {res_ssh.stderr}")

if os.path.exists(archive_path):
    os.remove(archive_path)
print('5. Local cleanup done.')
