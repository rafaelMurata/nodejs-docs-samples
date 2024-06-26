# Connecting to Cloud SQL - MS SQL Server

## Before you begin

1. If you haven't already, set up a Node.js Development Environment by following
the [Node.js setup guide](https://cloud.google.com/nodejs/docs/setup)  and
[create a
project](https://cloud.google.com/resource-manager/docs/creating-managing-projects#creating_a_project).

1. [Create a Google Cloud SQL "SQL Server" instance](
    <https://cloud.google.com/sql/docs/sqlserver/create-instance>). Note the
    instance `connection name` of the instance that you create, and password
    that you specify for the default 'sqlserver' user.

1. Under the instance's "DATABASES" tab, create a new database.

    1. Click **Create database**.

    1. For **Database name**, enter `votes`.

    1. Click **CREATE**.

1. Set up [Application Default Credentials][adc]

[adc]: https://cloud.google.com/docs/authentication/provide-credentials-adc

## Running locally

Use the information noted in the previous steps to set the following environment
variables:

```bash
export INSTANCE_CONNECTION_NAME='<MY-PROJECT>:<INSTANCE-REGION>:<INSTANCE-NAME>'
export INSTANCE_HOST='127.0.0.1'
export DB_PORT='1433'
export DB_USER='my-db-user'
export DB_PASS='my-db-pass'
export DB_NAME='my_db'
```

Note: Defining credentials in environment variables is convenient, but not
secure. For a more secure solution, use [Secret
Manager](https://cloud.google.com/secret-manager/) to help keep secrets safe.
You can then define `export
CLOUD_SQL_CREDENTIALS_SECRET='projects/PROJECT_ID/secrets/SECRET_ID/versions/VERSION'`
to reference a secret that stores your Cloud SQL database password. The sample
app checks for your defined secret version. If a version is present, the app
retrieves the `DB_PASS` from Secret Manager before it connects to Cloud SQL.

Download and install the `cloud_sql_proxy` by following the instructions
[here](https://cloud.google.com/sql/docs/mysql/sql-proxy#install).

Then, use the following command to start the proxy in the background using TCP:

```bash
./cloud-sql-proxy --port=1433 "$INSTANCE_CONNECTION_NAME" &
```

Next, setup install the requirements with `npm`:

```bash
npm install
```

Finally, start the application:

```bash
npm start
```

Navigate towards `http://127.0.0.1:8080` to verify your application is running
correctly.

## Deploy to Google App Engine Flexible

App Engine Flexible supports connecting to your SQL Server instance through TCP

First, update [`app.flexible.yaml`](app.flexible.yaml) with the correct values
to pass the environment variables and instance name into the runtime.

Then, make sure that the service account
`service-{PROJECT_NUMBER}>@gae-api-prod.google.com.iam.gserviceaccount.com` has
the IAM role `Cloud SQL Client`.

The following command will deploy the application to your Google Cloud project:

```bash
gcloud app deploy app.flexible.yaml
```

## Deploy to Cloud Functions

To deploy the service to [Cloud Functions](https://cloud.google.com/functions/docs) run the following command:

```sh
gcloud functions deploy votes --gen2 --runtime nodejs18 --trigger-http \
  --allow-unauthenticated \
  --entry-point votes \
  --region <INSTANCE_REGION> \
  --set-env-vars INSTANCE_HOST='127.0.0.1'> \
  --set-env-vars DB_PORT='1433' \
  --set-env-vars DB_USER=$DB_USER \
  --set-env-vars DB_PASS=$DB_PASS \
  --set-env-vars DB_NAME=$DB_NAME
```

Note: If the function fails to deploy or returns a `500: Internal service error`,
this may be due to a known limitation with Cloud Functions gen2 not being able
to configure the underlying Cloud Run service with a Cloud SQL connection.

A workaround command to fix this is is to manually revise the Cloud Run
service with the Cloud SQL Connection:

```sh
gcloud run deploy votes --source . \
  --region <INSTANCE_REGION> \
  --add-cloudsql-instances <PROJECT_ID>:<INSTANCE_REGION>:<INSTANCE_NAME>
```

The Cloud Function command above can now be re-run with a successful deployment.
