import * as https from "request-promise-native"
import * as winston from "winston"
import * as Hub from "../../hub"

export class KloudioAction extends Hub.Action {

  name = "kloudio"
  label = "Kloudio"
  iconName = "kloudio/kloudio.svg"
  description = "Add records to a Google Spreadsheet."
  params = [
    {
      description: "API URL for Kloudio from account page",
      label: "Kloudio API URL",
      name: "kloudio_api_url",
      required: true,
      sensitive: true,
    },
  ]
  supportedActionTypes = [Hub.ActionType.Query]
  supportedFormats = [Hub.ActionFormat.JsonDetail]
  supportedFormattings = [Hub.ActionFormatting.Unformatted]
  supportedVisualizationFormattings = [Hub.ActionVisualizationFormatting.Noapply]

  async execute(request: Hub.ActionRequest) {
    if (!(request.attachment && request.attachment.dataJSON)) {
        throw "No attached json."
    }

    if (!(request.formParams.api_key)) {
        throw "Missing API key"
    }

    if (!( request.formParams.url)) {
        throw "Missing Google sheets URL"
    }

    if (!(request.formParams.token)) {
        throw "Missing Google Sheets Access Token"
    }

    // const qr = request.attachment.dataJSON
    /*if (!qr.fields || !qr.data) {
      throw "Request payload is an invalid format."
    }*/

    let response
    winston.info(request.formParams.api_key)
    winston.info(request.formParams.url)
    winston.info(request.formParams.token)
    winston.info(request.attachment.dataJSON)
    try {
        const uri = JSON.stringify(request.params.kloudio_api_url)
        winston.info("uri is:" + uri)
        console.log("uri is:" + uri);

        response = await https.post({
        url: uri,
        body: JSON.stringify({api_key: request.formParams.api_key, url: request.formParams.url,
            token: request.formParams.token, info: request.attachment.dataJSON}),
         }).catch((_err) => { winston.error(_err.toString()) })
    } catch (e) {
      response = { success: false, message: e.message }
    }
    return new Hub.ActionResponse(response)
  }

  async form() {
    const form = new Hub.ActionForm()
    form.fields = [{
      label: "API Key",
      name: "api_key",
      required: true,
      type: "string",
    }, {
      label: "Google Sheets URL",
      name: "url",
      required: true,
      type: "string",
    }, {
        label: "Google Sheets Access Token",
        name: "token",
        required: true,
        type: "string",
      }]
    return form
  }

}

Hub.addAction(new KloudioAction())