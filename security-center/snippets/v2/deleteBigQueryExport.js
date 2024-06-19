/*
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use strict';

/**
 *  Delete an existing BigQuery export.
 */
function main(organizationId, exportId, location = 'global') {
  // [START securitycenter_delete_bigquery_export_v2]
  // Imports the Google Cloud client library.
  const {SecurityCenterClient} = require('@google-cloud/security-center').v2;

  // Creates a new client.
  const client = new SecurityCenterClient();
  /**
   *  Required. The name of the BigQuery export to delete. The following list
   *  shows some examples of the format:
   *  `organizations/{organization}/locations/{location}/bigQueryExports/{export_id}`
   *  `folders/{folder}/locations/{location}/bigQueryExports/{export_id}`
   *  `projects/{project}/locations/{location}/bigQueryExports/{export_id}`
   */
  const name = `organizations/${organizationId}/locations/${location}/bigQueryExports/${exportId}`;

  // Build the request.
  const deleteBigQueryExportRequest = {
    name,
  };

  async function deleteBigQueryExport() {
    // Call the API.
    const [response] = await client.deleteBigQueryExport(
      deleteBigQueryExportRequest
    );
    console.log('BigQuery export request deleted successfully: %j', response);
  }

  deleteBigQueryExport();
  // [END securitycenter_delete_bigquery_export_v2]
}

main(...process.argv.slice(2));
