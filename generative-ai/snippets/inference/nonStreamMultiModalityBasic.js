// Copyright 2024 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

// [START generativeaionvertexai_non_stream_multimodality_basic]
const {VertexAI} = require('@google-cloud/vertexai');

/**
 * TODO(developer): Update these variables before running the sample.
 */
async function generateContent(
  projectId = 'PROJECT_ID',
  location = 'us-central1',
  model = 'gemini-1.5-pro-preview-0409'
) {
  // Initialize Vertex AI
  const vertexAI = new VertexAI({project: projectId, location: location});
  const generativeModel = vertexAI.getGenerativeModel({model: model});

  const request = {
    contents: [
      {
        role: 'user',
        parts: [
          {
            file_data: {
              file_uri: 'gs://cloud-samples-data/video/animals.mp4',
              mime_type: 'video/mp4',
            },
          },
          {
            file_data: {
              file_uri:
                'gs://cloud-samples-data/generative-ai/image/character.jpg',
              mime_type: 'image/jpeg',
            },
          },
          {text: 'Are this video and image correlated?'},
        ],
      },
    ],
  };

  const result = await generativeModel.generateContent(request);

  console.log(result.response.candidates[0].content.parts[0].text);
}
// [END generativeaionvertexai_non_stream_multimodality_basic]

generateContent(...process.argv.slice(2)).catch(err => {
  console.error(err.message);
  process.exitCode = 1;
});
