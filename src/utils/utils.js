export function getNotificationBody(body) {
    let result = `<div style="color: #f0f0f0">`
    for (const property in body) {
        if(body.hasOwnProperty(property)) {
            if(body[property]) {
                result += `${body[property]}`
            }
        }
    }
    result += `</div>`
    return result;
}