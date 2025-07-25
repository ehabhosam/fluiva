to deploy to the ec2 service brhm created

we build the project

```bash
make build
```

then send the project to the instance 

```bash
rsync -avz -e "ssh -i ~/.ssh/bobkeypairs.pem" ./app ec2-user@15.185.229.21:~/
```

then ssh into the instance


```bash
ssh -i ~/.ssh/bobkeypairs.pem ec2-user@15.185.229.21
```

and turn app into executable

```bash
chmod +x app
```

then run the app

```bash
./app
```