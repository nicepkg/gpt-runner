import https from 'node:https'

export class Openai {
  static async getCompletion(params = {}, openaiKey: string) {
    return new Promise((resolve, reject) => {
      const req = https.request(
        'https://api.openai.com/v1/chat/completions',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${openaiKey}`,
          },
        },
        (response) => {
          let responseData = ''
          response.on('data', (chunk) => {
            responseData += chunk
          })
          response.on('end', () => {
            const data = JSON.parse(responseData)
            if (response.statusCode! >= 200 && response.statusCode! < 300)
              return resolve(data)

            else
              return reject(new Error(`ERROR ${response.statusCode}: ${data.error.type}\nMessage: " + ${data.error.message}`))
          })
        },
      )

      req.write(JSON.stringify(params))
      req.end()
    })
  }
}
