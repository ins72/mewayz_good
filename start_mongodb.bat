@echo off
echo Starting MongoDB...
"C:\Program Files\MongoDB\Server\7.0\bin\mongod.exe" --dbpath "C:\data\db" --port 27017 --bind_ip 127.0.0.1
pause 