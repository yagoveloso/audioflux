import Fastify, { FastifyRequest, FastifyReply } from "fastify";
import fastifyMultipart from "@fastify/multipart";
import fs from "fs";
import path from "path";
import ffmpeg from "fluent-ffmpeg";

// Cria uma instância do Fastify
const app = Fastify({ logger: true });

// Registra suporte a arquivos multipart
app.register(fastifyMultipart, {
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB
  },
});

// Middleware para verificação de token
const verifyToken = async (req: FastifyRequest, reply: FastifyReply) => {
  const authHeader = req.headers.authorization;

  // Verifica se o header de autorização existe e está no formato "Bearer <token>"
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return reply
      .status(401)
      .send({ error: "Unauthorized: token ausente ou inválido" });
  }

  // Extrai o token removendo o "Bearer "
  const token = authHeader.slice(7).trim();

  // Valide o token (pode ser via comparação com um token armazenado em variável de ambiente, por exemplo)
  const validToken = process.env.API_TOKEN || "mysecrettoken"; // substitua "mysecrettoken" pelo seu token

  if (token !== validToken) {
    return reply.status(401).send({ error: "Unauthorized: token inválido" });
  }
};

// Define a rota para converter arquivos com verificação de token
app.post("/convert", { preHandler: verifyToken }, async (req, reply) => {
  const data = await req.file();

  if (!data) {
    return reply.status(400).send({ error: "Nenhum arquivo enviado" });
  }

  const inputFilePath = path.join(__dirname, "..", "uploads", data.filename);
  const outputFilePath = path.join(
    __dirname,
    "..",
    "outputs",
    `${Date.now()}.webm`
  );

  // Cria diretórios se não existirem
  if (!fs.existsSync("uploads")) fs.mkdirSync("uploads");
  if (!fs.existsSync("outputs")) fs.mkdirSync("outputs");

  // Salva o arquivo enviado
  const fileStream = fs.createWriteStream(inputFilePath);
  await data.file.pipe(fileStream);

  return new Promise<void>((resolve, reject) => {
    fileStream.on("finish", () => {
      // Converte para WEBM
      ffmpeg(inputFilePath)
        .output(outputFilePath)
        .audioBitrate(64) // Define bitrate de áudio para 64kbps (qualidade baixa)
        .format("webm")
        .on("end", () => {
          // Envia o arquivo convertido na resposta
          reply.header("Content-Type", "audio/webm");
          reply.header(
            "Content-Disposition",
            `attachment; filename="${path.basename(outputFilePath)}"`
          );

          const readStream = fs.createReadStream(outputFilePath);

          // Aguarda o fechamento do stream antes de resolver a Promise
          readStream.on("close", () => {
            // Aqui você pode remover os arquivos temporários, se desejar.
            fs.unlink(inputFilePath, (err) => {
              if (err)
                console.error(
                  `Erro ao remover o arquivo de entrada: ${inputFilePath}`,
                  err
                );
            });
            fs.unlink(outputFilePath, (err) => {
              if (err)
                console.error(
                  `Erro ao remover o arquivo de saída: ${outputFilePath}`,
                  err
                );
            });
            resolve();
          });

          reply.send(readStream);
        })
        .on("error", (err) => {
          reject(reply.status(500).send({ error: err.message }));
        })
        .run();
    });
  });
});

// Inicializa o servidor
const start = async () => {
  try {
    await app.listen({ port: 3000, host: "0.0.0.0" });
    console.log("🚀 API rodando em http://localhost:3000");

    // Define o timeout para 5 minutos (300000 ms)
    app.server.setTimeout(300000);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
