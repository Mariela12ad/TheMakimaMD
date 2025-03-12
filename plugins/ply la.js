/* ౨ৎ ˖ ࣪⊹ 𝐁𝐲 𝐉𝐭𝐱𝐬 𐙚˚.ᡣ𐭩 ❀ Canal Principal ≽^•˕• ྀི≼ https://whatsapp.com/channel/0029VaeQcFXEFeXtNMHk0D0n ❀ Canal Rikka Takanashi Bot https://whatsapp.com/channel/0029VaksDf4I1rcsIO6Rip2X ❀ Canal StarlightsTeam https://whatsapp.com/channel/0029VaBfsIwGk1FyaqFcK91S ❀ HasumiBot FreeCodes https://whatsapp.com/channel/0029Vanjyqb2f3ERifCpGT0W */

// *𓍯𓂃𓏧♡ PLAY (audio - video)*
import fetch from 'node-fetch'
import yts from 'yt-search'

let handler = async (m, { conn, text, args }) => {
  if (!text) return conn.reply(m.chat, `❀ Ingresa el nombre de lo que quieres buscar`, m)

  try {
    let res = await search(args.join(" "))
    if (!res || !res[0]) {
      throw new Error("No se encontraron resultados")
    }

    let apiAud = await fetch(`https://api.agungny.my.id/api/youtube-audio?url=${'https://youtu.be/' + res[0].videoId}`)
    if (!apiAud.ok) {
      throw new Error(`Error al obtener el audio: ${apiAud.statusText}`)
    }

    let dataAud = await apiAud.json()
    if (!dataAud.result || !dataAud.result.downloadUrl) {
      throw new Error("No se encontró la URL de descarga del audio")
    }

    let apiVid = await fetch(`https://api.agungny.my.id/api/youtube-video?url=${'https://youtu.be/' + res[0].videoId}`)
    if (!apiVid.ok) {
      throw new Error(`Error al obtener el video: ${apiVid.statusText}`)
    }

    let dataVid = await apiVid.json()
    if (!dataVid.result || !dataVid.result.downloadUrl) {
      throw new Error("No se encontró la URL de descarga del video")
    }

    let txt = `*◆ [ YOUTUBE - PLAY ] ◆* - *Titulo:* ${res[0].title} - *Duracion:* ${res[0].timestamp} - *Visitas:* ${res[0].views} - *Subido:* ${res[0].ago} ◆────────────────◆ Responde a este mensaje dependiendo lo que quieras : 1 : Audio 2 : Video`
    let SM = await conn.sendFile(m.chat, res[0].thumbnail, 'HasumiBotFreeCodes.jpg', txt, m)

    conn.ev.on("messages.upsert", async (upsertedMessage) => {
      let RM = upsertedMessage.messages[0];
      if (!RM.message) return
      const UR = RM.message.conversation || RM.message.extendedTextMessage?.text
      let UC = RM.key.remoteJid

      if (RM.message.extendedTextMessage?.contextInfo?.stanzaId === SM.key.id) {
        if (UR === '1') {
          await conn.sendMessage(UC, { audio: { url: dataAud.result.downloadUrl }, mimetype: "audio/mpeg", caption: null }, { quoted: RM })
        } else if (UR === '2') {
          await conn.sendMessage(m.chat, { video: { url: dataVid.result.downloadUrl }, caption: ``, mimetype: 'video/mp4', fileName: `${res[0].title}` + `.mp4`}, {quoted: m })
        } else {
          await conn.sendMessage(UC, { text: "Opcion invalida, responde con 1 *(audio)* o 2 *(video)*." }, { quoted: RM })
        }
      }
    })
  } catch (error) {
    console.error(error)
    conn.reply(m.chat, `Error: ${error.message}`, m)
  }
}

handler.command = ["pl"]

export default handler

async function search(query, options = {}) {
  let search = await yts.search({ query, hl: "es", gl
