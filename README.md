# Qr Pay Server
Scan to pay.


# Contribution 
Fork the repo then clone
```bash
git clone https://github.com/imrany/qr-pay-server.api
```
then 
```bash
cd Wekafile.api
```
Engine configurations,
ensure you have
`node v14.19.1` 
and 
`npm v6.14.16`
then
```bash
npm i
```

Then Run
```bash 
docker-compose up -d
```
### Run migration
sqlx migrate run


### To add Student record
On Unix
```bash
curl --header "Content-Type: application/json" --request POST --data '{"full_name":"full name","school":"SSAE","registration_number":"CSC/000/2021","type":"student","id_number":"23456789","year_of_entry":"2021","year_of_exit":"2025","academic_year":"2024/2025","semester":1,"campus":"MAIN","course":"Bachelor in computer science","phone_number":"2547xxxxxxxx"}' http://localhost:8080/api/identify/add```

On windows
```bash
curl --header "Content-Type: application/json" --request POST --data "{\"full_name\":\"full name\",\"school\":\"ssae\",\"registration_number\":\"CSC/000/2021\",\"type\":\"student\",\"id_number\":\"23456789\",\"year_of_entry\":\"2021\",\"year_of_exit\":\"2025\",\"academic_year\":\"2024/2025\",\"semester\":1,\"campus\":\"MAIN\",\"course\":\"Bachelor in computer science\",\"phone_number\":\"2547xxxxxxxx\"}" http://localhost:8080/api/identify/add```

### Get student access record
```bash
curl --request GET http://localhost:8080/api/admin/track_access
```
