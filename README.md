# CourseTracker API

* *Date Created*: 19 Feb 2022

## Authors

* [Isaac Dunnett](is560393@dal.ca) - *(Developer)*
* [Keaton Gibb](kgibb@dal.ca) - *(Developer)*

## Built With

* [Express](https://expressjs.com/)
* [DynamoDB](https://aws.amazon.com/dynamodb/)

## DynamoDB info

To start dynamodb locally on port 8000:

```text
docker run -d --rm -p 8000:8000 amazon/dynamodb-local -jar DynamoDBLocal.jar -inMemory -sharedDb
```

List tables:

```text
aws dynamodb list-tables --endpoint-url http://localhost:8000
```

Describe a table:

```text
aws dynamodb describe-table --table-name {tableName} --endpoint-url http://localhost:8000
```

Delete a table:

```text
aws dynamodb delete-table --table-name {tableName} --endpoint-url http://localhost:8000
```
