import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create transporter using environment variables if provided
function createTransporter() {
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const secure = process.env.SMTP_SECURE === 'true' || port === 465;

  if (host && user && pass) {
    return nodemailer.createTransport({
      host,
      port,
      secure,
      auth: { user, pass },
    });
  }

  // Fallback: If no custom SMTP credentials provided, try standard local or simulated transporter
  return nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
      user: 'ethereal.user@ethereal.email',
      pass: 'ethereal.pass',
    },
  });
}

const transporter = createTransporter();

export async function sendVerificationCodeEmail(
  toEmail: string,
  name: string,
  code: string
): Promise<{ success: boolean; messageId?: string; simulated?: boolean }> {
  const senderAddress = process.env.EMAIL_FROM || '"Admin Money" <contato@adminmoney.com.br>';

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Código de Verificação - Admin Money</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #050706; color: #FFFFFF; margin: 0; padding: 24px; }
        .container { max-width: 520px; margin: 0 auto; background-color: #101613; border: 1px solid #1F2B23; border-radius: 24px; padding: 36px 28px; box-sizing: border-box; text-align: center; }
        .logo { font-size: 24px; font-weight: 900; color: #00E676; letter-spacing: -0.5px; margin-bottom: 24px; }
        h1 { font-size: 20px; font-weight: 800; color: #FFFFFF; margin: 0 0 12px 0; }
        p { font-size: 14px; line-height: 1.6; color: #9CAE9F; margin: 0 0 24px 0; }
        .code-box { background-color: #151D18; border: 2px dashed #00E676; border-radius: 16px; padding: 20px; margin: 24px 0; font-family: 'Courier New', Courier, monospace; font-size: 34px; font-weight: 900; letter-spacing: 8px; color: #00E676; display: inline-block; min-width: 240px; }
        .footer { font-size: 11px; color: #65796A; margin-top: 32px; border-top: 1px solid #1F2B23; padding-top: 20px; line-height: 1.5; }
        .badge { display: inline-block; background-color: rgba(0, 230, 118, 0.15); color: #00E676; font-size: 11px; font-weight: 700; padding: 4px 12px; border-radius: 100px; margin-bottom: 16px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="logo">⚡ Admin Money</div>
        <div class="badge">3 DIAS GRÁTIS DE TESTE</div>
        <h1>Confirme seu E-mail</h1>
        <p>Olá, <strong>${name || 'Usuário'}</strong>! Recebemos sua solicitação de cadastro no micro-SaaS Admin Money. Utilize o código de 6 dígitos abaixo para ativar seu período de degustação de 3 dias:</p>
        
        <div class="code-box">${code}</div>
        
        <p style="font-size: 12px; color: #65796A;">Este código expira em <strong>10 minutos</strong>. Se você não solicitou este cadastro, pode desconsiderar esta mensagem com total segurança.</p>
        
        <div class="footer">
          Admin Money • Plataforma Inteligente de Gestão Financeira<br>
          WhatsApp Comercial: (21) 99658-9629
        </div>
      </div>
    </body>
    </html>
  `;

  const textContent = `Admin Money - Código de Confirmação\n\nOlá, ${name || 'Usuário'}!\n\nSeu código de verificação é: ${code}\n\nEste código é válido por 10 minutos.\n\nWhatsApp Comercial: (21) 99658-9629`;

  console.log(`\n========================================`);
  console.log(`[EMAIL DISPATCH] Enviando código de verificação para: ${toEmail}`);
  console.log(`[CÓDIGO DE VERIFICAÇÃO]: ${code}`);
  console.log(`========================================\n`);

  try {
    const info = await transporter.sendMail({
      from: senderAddress,
      to: toEmail,
      subject: `${code} é seu código de verificação do Admin Money`,
      text: textContent,
      html: htmlContent,
    });

    console.log(`[EMAIL DISPATCH SUCCESS] MessageId: ${info.messageId}`);
    return { success: true, messageId: info.messageId, simulated: false };
  } catch (error: any) {
    console.warn(`[EMAIL DISPATCH WARN] Não foi possível conectar ao servidor SMTP externo: ${error.message}`);
    console.log(`[EMAIL FALLBACK] O código ${code} para ${toEmail} foi registrado no console e está ativo no sistema.`);
    return { success: true, simulated: true };
  }
}
