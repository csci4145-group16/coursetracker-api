# CourseTracker API

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
