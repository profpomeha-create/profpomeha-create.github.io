import os
import subprocess
import tarfile

workspace_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
archive_path = os.path.join(workspace_root, 'deploy_output.tar.gz')
public_dir = os.path.join(workspace_root, '.output', 'public')
nginx_conf = os.path.join(workspace_root, 'deploy', 'nginx-aaa.is-a.dev.conf')

print('1. Creating tar.gz archive...')
with tarfile.open(archive_path, 'w:gz') as tar:
    tar.add(public_dir, arcname='.')
print(f'Archive size: {os.path.getsize(archive_path)} bytes')

print('2. Uploading static bundle to getsaldo...')
res_scp_bundle = subprocess.run(
    ['scp', archive_path, 'getsaldo:/tmp/deploy_output.tar.gz'],
    capture_output=True,
    text=True,
)
print('SCP bundle returncode:', res_scp_bundle.returncode)
if res_scp_bundle.stderr:
    print('SCP bundle stderr:', res_scp_bundle.stderr)

print('3. Uploading Nginx configuration...')
res_scp_nginx = subprocess.run(
    ['scp', nginx_conf, 'getsaldo:/etc/nginx/sites-available/aaa.is-a.dev'],
    capture_output=True,
    text=True,
)
print('SCP nginx returncode:', res_scp_nginx.returncode)
if res_scp_nginx.stderr:
    print('SCP nginx stderr:', res_scp_nginx.stderr)

print('4. Executing remote deployment commands on getsaldo...')
remote_cmds = (
    'tar -xzf /tmp/deploy_output.tar.gz -C /var/www/aaa && '
    'rm -f /tmp/deploy_output.tar.gz && '
    'find /var/www/aaa -type f \\( -name "*.html" -o -name "*.css" -o -name "*.js" -o -name "*.xml" \\) -exec gzip -k -9 -f {} + && '
    'chown -R www-data:www-data /var/www/aaa && '
    'chmod -R u=rwX,go=rX /var/www/aaa && '
    'nginx -t && systemctl reload nginx'
)

res_ssh = subprocess.run(
    ['ssh', '-o', 'BatchMode=yes', 'getsaldo', remote_cmds],
    capture_output=True,
    text=True,
)
print('SSH returncode:', res_ssh.returncode)
print('SSH stdout:', res_ssh.stdout)
if res_ssh.stderr:
    print('SSH stderr:', res_ssh.stderr)

if os.path.exists(archive_path):
    os.remove(archive_path)
print('5. Local cleanup done.')
