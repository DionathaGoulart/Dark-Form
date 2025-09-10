import emailjs from '@emailjs/browser'
import type { FormData } from '../types/form'

// Configure suas credenciais do EmailJS usando as variáveis de ambiente
const EMAIL_CONFIG = {
  serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID,
  templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
  userId: import.meta.env.VITE_EMAILJS_USER_ID
}

export const sendFormEmail = async (formData: FormData): Promise<boolean> => {
  try {
    // Validação das variáveis de ambiente
    if (
      !EMAIL_CONFIG.serviceId ||
      !EMAIL_CONFIG.templateId ||
      !EMAIL_CONFIG.userId
    ) {
      console.error(
        'EmailJS não está configurado corretamente. Verifique as variáveis de ambiente.'
      )
      console.error('Configurações:', EMAIL_CONFIG) // Debug
      return false
    }

    // Formatando as respostas para o template de email
    const formattedAnswers = formData.answers
      .map(
        (answer, index) =>
          `${index + 1}. ${answer.question}\nResposta: ${answer.answer}`
      )
      .join('\n\n')

    const templateParams = {
      to_email: import.meta.env.VITE_EMAIL_TO,
      subject: `Nova submissão de formulário - ${new Date().toLocaleDateString(
        'pt-BR'
      )}`,
      message: `Formulário submetido em: ${formData.submittedAt.toLocaleString(
        'pt-BR'
      )}\n\n${formattedAnswers}`,
      from_name: 'Formulário TypeForm Clone'
    }

    const response = await emailjs.send(
      EMAIL_CONFIG.serviceId,
      EMAIL_CONFIG.templateId,
      templateParams,
      EMAIL_CONFIG.userId
    )

    console.log('Email enviado com sucesso:', response.status, response.text)
    return true
  } catch (error) {
    console.error('Erro ao enviar email:', error)
    return false
  }
}

// Função para inicializar o EmailJS (chame uma vez no início da aplicação)
export const initEmailJS = () => {
  emailjs.init(EMAIL_CONFIG.userId)
}
