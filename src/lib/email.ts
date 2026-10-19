export async function sendEnquiryNotification(input:{referenceNumber:string,name:string,email:string,type:string,message:string}){const apiKey=process.env.EMAIL_API_KEY;const to=process.env.ENQUIRY_NOTIFICATION_EMAIL;const from=process.env.EMAIL_FROM;if(!apiKey||!to||!from)return {sent:false,reason:"email_not_configured" as const};const response=await fetch("https://api.resend.com/emails",{method:"POST",headers:{Authorization:`Bearer ${apiKey}`,"Content-Type":"application/json"},body:JSON.stringify({from,to,subject:`New Anchorship enquiry ${input.referenceNumber}`,text:`Reference: ${input.referenceNumber}
Type: ${input.type}
Name: ${input.name}
Email: ${input.email}

${input.message}`})});if(!response.ok)return {sent:false,reason:"provider_error" as const};return {sent:true};}
