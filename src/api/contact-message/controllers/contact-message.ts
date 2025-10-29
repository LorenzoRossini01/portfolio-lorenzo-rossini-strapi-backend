import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::contact-message.contact-message",
  ({ strapi }) => ({
    async create(ctx) {
      const response = await super.create(ctx);

      const { name, email, message } = response.data;

      try {
        // Email al cliente
        await strapi
          .plugin("email-designer-v5")
          .service("email")
          .sendTemplatedEmail(
            {
              to: email,
            },
            {
              templateReferenceId: 1,
            },
            {
              recipientName: name,
            }
          );

        // Email all'amministratore
        await strapi
          .plugin("email-designer-v5")
          .service("email")
          .sendTemplatedEmail(
            {
              to: "lory.rox.01@gmail.com",
            },
            {
              templateReferenceId: 2,
            },
            {
              adminName: "Lorenzo",
              senderName: name,
              senderEmail: email,
              message: message,
            }
          );
      } catch (err) {
        console.error("Errore invio email:", err);
        if (err.stack) console.error(err.stack);
        if (err.response) console.error("Response:", err.response);
        ctx.throw(
          500,
          "Errore durante l’invio dell’email: " + (err.message || err)
        );
      }

      return response;
    },
  })
);
