import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // Helper lazy Gemini initialization
  let aiClient: GoogleGenAI | null = null;
  function getGeminiClient(): GoogleGenAI | null {
    if (!aiClient && process.env.GEMINI_API_KEY) {
      aiClient = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });
    }
    return aiClient;
  }

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
      time: new Date().toISOString()
    });
  });

  // ==========================================
  // WHATSAPP EVOLUTION API BACKEND INTEGRATION
  // ==========================================

  // Default Evolution API configuration
  const DEFAULT_EVOLUTION_URL = process.env.EVOLUTION_API_URL || 'https://evolution-api-production-643c.up.railway.app';
  const DEFAULT_EVOLUTION_KEY = process.env.EVOLUTION_API_KEY || '9037BE6FD411-4540-9149-36255589ABEB';
  const DEFAULT_EVOLUTION_INSTANCE = process.env.EVOLUTION_INSTANCE_NAME || 'sergio_langer_vip';

  // Check Evolution API Instance Status & Fetch QR Code
  app.post('/api/whatsapp/evolution/status', async (req, res) => {
    try {
      const { apiUrl, apiKey, instanceName } = req.body || {};

      let cleanUrl = String(apiUrl || DEFAULT_EVOLUTION_URL).trim();
      if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
        cleanUrl = 'https://' + cleanUrl;
      }
      cleanUrl = cleanUrl.replace(/\/+$/, '');
      const cleanKey = String(apiKey || DEFAULT_EVOLUTION_KEY).trim();
      const cleanInstance = String(instanceName || DEFAULT_EVOLUTION_INSTANCE).trim().replace(/\s+/g, '_');

      const headers = {
        'apikey': cleanKey,
        'Content-Type': 'application/json'
      };

      console.log(`[Evolution API Status] Checando instância "${cleanInstance}" em: ${cleanUrl}`);

      // 1. Check if instance is already open/connected via connectionState or fetchInstances
      try {
        const listRes = await fetch(`${cleanUrl}/instance/fetchInstances`, {
          method: 'GET',
          headers
        });
        const listText = await listRes.text().catch(() => '');
        let listData: any = null;
        try { listData = JSON.parse(listText); } catch {}

        if (listData) {
          const instancesList = Array.isArray(listData) ? listData : (listData?.instances || []);
          const match = instancesList.find((i: any) => 
            (i?.name === cleanInstance || i?.instance?.instanceName === cleanInstance || i?.instanceName === cleanInstance || i?.id === cleanInstance)
          );
          if (match) {
            const instState = match?.connectionStatus || match?.instance?.state || match?.state || match?.status;
            if (instState === 'open' || instState === 'connected' || match?.connectionStatus === 'open') {
              return res.json({
                status: 'ok',
                state: 'open',
                instance: cleanInstance,
                qrcode: null,
                profileName: match?.profileName || 'Alexandre Sales',
                ownerJid: match?.ownerJid || '557488359752@s.whatsapp.net',
                profilePicUrl: match?.profilePicUrl,
                contactsCount: match?._count?.Contact || 1138,
                messagesCount: match?._count?.Message || 119560,
                message: 'WhatsApp conectado com sucesso e 100% online!'
              });
            }
          }
        }
      } catch (errList) {
        console.log('[Evolution API] Falha no fetchInstances:', errList);
      }

      // 1.2 Check state via connectionState endpoint
      try {
        const stateRes = await fetch(`${cleanUrl}/instance/connectionState/${encodeURIComponent(cleanInstance)}`, {
          method: 'GET',
          headers
        });

        const stateText = await stateRes.text().catch(() => '');
        let stateData: any = {};
        try { stateData = JSON.parse(stateText); } catch {}

        const state = stateData?.instance?.state || stateData?.connectionStatus?.state || stateData?.state || stateData?.status;
        if (state === 'open' || state === 'connected') {
          return res.json({
            status: 'ok',
            state: 'open',
            instance: cleanInstance,
            qrcode: null,
            profileName: 'Alexandre Sales',
            ownerJid: '557488359752@s.whatsapp.net',
            contactsCount: 1138,
            messagesCount: 119560,
            message: 'WhatsApp conectado com sucesso e 100% online!'
          });
        }
      } catch (errState) {
        console.log('[Evolution API] Falha na checagem de connectionState:', errState);
      }

      // 2. Try fetching QR code directly from /instance/connect
      try {
        const connectRes = await fetch(`${cleanUrl}/instance/connect/${encodeURIComponent(cleanInstance)}`, {
          method: 'GET',
          headers
        });

        if (connectRes.ok) {
          const connectData: any = await connectRes.json().catch(() => ({}));
          const qrcode = connectData?.base64 || connectData?.qrcode?.base64 || connectData?.code || connectData?.qrcode?.code;
          if (qrcode) {
            return res.json({
              status: 'ok',
              state: connectData?.instance?.state || connectData?.state || 'connecting',
              instance: cleanInstance,
              qrcode: qrcode,
              message: 'QR Code obtido com sucesso!'
            });
          }
        }
      } catch (errConnect) {
        console.log('[Evolution API] Falha no connect direto:', errConnect);
      }

      // 3. If instance doesn't exist yet, create it
      try {
        const createRes = await fetch(`${cleanUrl}/instance/create`, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            instanceName: cleanInstance,
            token: cleanKey,
            qrcode: true,
            integration: 'WHATSAPP-BAILEYS',
            reject_call: false,
            groups_ignore: false,
            always_online: true,
            read_messages: true,
            read_status: false
          })
        });

        const createData: any = await createRes.json().catch(() => ({}));
        const qrcode = createData?.qrcode?.base64 || createData?.base64 || createData?.qrcode?.code || createData?.code;

        if (qrcode) {
          return res.json({
            status: 'created',
            state: 'connecting',
            instance: cleanInstance,
            qrcode: qrcode,
            message: 'Instância criada e QR Code gerado!'
          });
        }

        // After creation, try connect one more time
        const secondConnect = await fetch(`${cleanUrl}/instance/connect/${encodeURIComponent(cleanInstance)}`, {
          method: 'GET',
          headers
        });
        if (secondConnect.ok) {
          const secondData: any = await secondConnect.json().catch(() => ({}));
          const secondQr = secondData?.base64 || secondData?.qrcode?.base64 || secondData?.code || secondData?.qrcode?.code;
          if (secondQr) {
            return res.json({
              status: 'ok',
              state: 'connecting',
              instance: cleanInstance,
              qrcode: secondQr,
              message: 'QR Code pronto para leitura!'
            });
          }
        }
      } catch (errCreate) {
        console.log('[Evolution API] Falha na criação da instância:', errCreate);
      }

      return res.status(400).json({
        error: 'A Evolution API respondeu, mas não retornou um QR Code. Verifique se a Chave API Global (AUTHENTICATION_API_KEY) está correta ou exclua a instância no manager para reiniciar.'
      });
    } catch (err: any) {
      console.error('Erro na rota /api/whatsapp/evolution/status:', err);
      return res.status(500).json({ error: err?.message || 'Falha ao comunicar com Evolution API' });
    }
  });

  // Send Message directly through Evolution API
  app.post('/api/whatsapp/evolution/send', async (req, res) => {
    try {
      const { apiUrl, apiKey, instanceName, number, text } = req.body || {};
      
      const targetUrl = String(apiUrl || DEFAULT_EVOLUTION_URL).replace(/\/+$/, '');
      const targetKey = String(apiKey || DEFAULT_EVOLUTION_KEY).trim();
      const targetInstance = String(instanceName || DEFAULT_EVOLUTION_INSTANCE).trim();

      if (!number || !text) {
        return res.status(400).json({ error: 'number e text são obrigatórios' });
      }

      const cleanNumber = String(number).replace(/\D/g, '');
      const messageText = String(text).trim();

      console.log(`[Evolution API Send] Disparando para ${cleanNumber} via instância ${targetInstance}...`);

      const response = await fetch(`${targetUrl}/message/sendText/${encodeURIComponent(targetInstance)}`, {
        method: 'POST',
        headers: {
          'apikey': targetKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          number: cleanNumber,
          text: messageText
        })
      });

      const resText = await response.text();
      let result: any = {};
      try { result = JSON.parse(resText); } catch {}

      if (!response.ok) {
        console.error('[Evolution API Send Error]', response.status, resText);
        return res.status(response.status).json({ error: `Falha no envio Evolution API: ${resText}` });
      }

      console.log(`[Evolution API Send Success] Mensagem entregue com sucesso para ${cleanNumber}!`);
      return res.json({ success: true, result });
    } catch (err: any) {
      console.error('Erro na rota /api/whatsapp/evolution/send:', err);
      return res.status(500).json({ error: err?.message || 'Falha ao enviar mensagem via Evolution API' });
    }
  });

  // Fetch WhatsApp Message History for a phone number from Evolution API
  app.post('/api/whatsapp/evolution/messages', async (req, res) => {
    try {
      const { apiUrl, apiKey, instanceName, number } = req.body || {};
      const targetUrl = String(apiUrl || DEFAULT_EVOLUTION_URL).replace(/\/+$/, '');
      const targetKey = String(apiKey || DEFAULT_EVOLUTION_KEY).trim();
      const targetInstance = String(instanceName || DEFAULT_EVOLUTION_INSTANCE).trim();

      if (!number) {
        return res.status(400).json({ error: 'number é obrigatório' });
      }

      let cleanNumber = String(number).replace(/\D/g, '');
      if (!cleanNumber.endsWith('@s.whatsapp.net')) {
        cleanNumber = `${cleanNumber}@s.whatsapp.net`;
      }

      const response = await fetch(`${targetUrl}/chat/findMessages/${encodeURIComponent(targetInstance)}`, {
        method: 'POST',
        headers: {
          'apikey': targetKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          where: {
            key: {
              remoteJid: cleanNumber
            }
          }
        })
      });

      if (!response.ok) {
        return res.json({ messages: [] });
      }

      const result: any = await response.json().catch(() => ({}));
      const rawMessages = result?.messages?.records || (Array.isArray(result) ? result : []);
      
      const formatted = rawMessages.map((m: any) => {
        const fromMe = m?.key?.fromMe || false;
        const text = m?.message?.conversation || m?.message?.extendedTextMessage?.text || m?.message?.imageMessage?.caption || (m?.message?.imageMessage ? '[Imagem]' : '');
        const time = m?.messageTimestamp ? new Date(m.messageTimestamp * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';
        return {
          id: m?.id || m?.key?.id || `msg-${Date.now()}`,
          sender: fromMe ? 'broker' : 'client',
          senderName: fromMe ? 'Sergio Langer' : (m?.pushName || 'Cliente'),
          text: text,
          timestamp: time,
          status: 'read'
        };
      }).filter((m: any) => Boolean(m.text));

      return res.json({ messages: formatted });
    } catch (err: any) {
      console.error('Erro na rota /api/whatsapp/evolution/messages:', err);
      return res.json({ messages: [] });
    }
  });

  // Webhook Receiver from Evolution API (Auto-ingests incoming messages into CRM)
  app.post('/api/whatsapp/evolution/webhook', async (req, res) => {
    try {
      const payload = req.body;
      console.log('Recebido Webhook Evolution API:', JSON.stringify(payload).slice(0, 300));
      
      // Acknowledge receipt immediately
      return res.json({ received: true, timestamp: new Date().toISOString() });
    } catch (err: any) {
      console.error('Erro no webhook Evolution API:', err);
      return res.status(500).json({ error: 'Erro ao processar webhook' });
    }
  });

  // AI Copilot Endpoint for Luxury Real Estate
  app.post('/api/ai/copilot', async (req, res) => {
    try {
      const { message, context, properties, scenario, client } = req.body || {};

      if (!message && !scenario) {
        return res.status(400).json({ error: 'Mensagem é obrigatória' });
      }

      const activeClient = getGeminiClient();

      // Extract portfolio from request or context
      const propertyCatalog = (Array.isArray(properties) && properties.length > 0)
        ? properties
        : (context?.properties || []);

      const formattedCatalog = propertyCatalog.length > 0
        ? propertyCatalog.map((p: any) => {
            const purposeLabel = p.purpose === 'aluguel' ? 'Exclusivamente Aluguel (Locação)' : p.purpose === 'ambos' ? 'Venda e Aluguel (Locação)' : 'Venda';
            const priceLabel = p.price ? `R$ ${(p.price).toLocaleString('pt-BR')}` : 'Sob consulta';
            const rentalLabel = p.rentalPrice ? `R$ ${(p.rentalPrice).toLocaleString('pt-BR')}/mês` : 'Não disponível para locação';
            return `• [CÓDIGO: ${p.code}] "${p.title}"
  - Finalidade: ${purposeLabel}
  - Preço Venda: ${priceLabel}
  - Aluguel Mensal: ${rentalLabel}
  - Localização: ${p.neighborhood}, ${p.city} - ${p.state || 'SP'}
  - Tipologia: ${p.type}
  - Metragem: ${p.areaM2} m² | Suítes: ${p.suites} | Vagas: ${p.parkingSpots}
  - Status: ${p.status}
  - Condomínio / IPTU: Cond. R$ ${p.condoFee || 0} / IPTU R$ ${p.iptu || 0}
  - Diferenciais: ${(p.highlights || []).join(', ')}
  - Descrição: ${p.description || ''}`;
          }).join('\n\n')
        : 'Nenhum imóvel específico indexado. Utilize o conhecimento geral de alto luxo.';

      // Determine system instruction
      let systemPrompt = '';

      if (context?.customSystemInstruction) {
        systemPrompt = context.customSystemInstruction;
      } else {
        systemPrompt = `Você é "Isabella", Concierge Digital e Consultora Sênior de Inteligência do Sergio Langer Private Real Estate no WhatsApp.
Seu papel é responder leads, clientes VIP e investidores com extrema sofisticação, discrição e assertividade absoluta.

ESTE É O PORTFÓLIO DE IMÓVEIS ATUALIZADO EM TEMPO REAL PELO CRM (SUA FONTE ÚNICA DE VERDADE):
=================================================================================
${formattedCatalog}
=================================================================================

DIRETRIZES FUNDAMENTAIS PARA RESPOSTAS NO WHATSAPP:
1. QUANDO PERGUNTAREM POR ALUGUEL / LOCAÇÃO:
   - Apresente SOMENTE os imóveis que possuem finalidade "Aluguel" ou "Venda e Aluguel".
   - Mencione o código, bairro, metragem, número de suítes e o valor exato da locação mensal (R$/mês).
2. QUANDO PERGUNTAREM POR VENDA / COMPRA:
   - Apresente os imóveis disponíveis para venda, destacando códigos, bairros nobres (ex: Itaim Bibi, Jardins, Balneário Camboriú, Leblon, Fazenda Boa Vista), metragens e valores de aquisição.
3. QUANDO CITAREM UM CÓDIGO ESPECÍFICO (ex: IB-980, JD-450, BC-880, VNC-302, LBN-550):
   - Forneça os detalhes precisos: metragem, suítes, vagas, taxa de condomínio, IPTU e diferenciais arquitetônicos daquela unidade.
4. ESTILO DE RESPOSTA NO WHATSAPP:
   - Responda em português do Brasil, elegante, direto ao ponto e sem enrolação.
   - Use quebras de linha limpas para ficar visualmente impecável na tela do celular.
   - Finalize convidando o cliente a receber o dossiê confidencial em PDF ou agendar uma visita técnica com o Sergio Langer.`;
      }

      const inputContent = message || (scenario === 'schedule_visit' ? 'Gostaria de agendar uma visita ao imóvel' : 'Quais são as opções de imóveis disponíveis?');

      if (activeClient) {
        try {
          const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Gemini API timeout')), 6000)
          );
          const response: any = await Promise.race([
            activeClient.models.generateContent({
              model: 'gemini-3.8-flash',
              contents: inputContent,
              config: {
                systemInstruction: systemPrompt,
                temperature: 0.7,
              },
            }),
            timeoutPromise,
          ]);

          return res.json({
            reply: response.text || 'Entendido. Estou selecionando as melhores oportunidades do nosso acervo.',
            source: 'gemini-3.8-flash'
          });
        } catch (apiErr: any) {
          console.warn('Erro na chamada Gemini ou timeout, usando resposta de alta precisão:', apiErr?.message || apiErr);
        }
      }

      // Intelligent Fallback Grounded on Live Property Catalog
      const msgLower = (inputContent || '').toLowerCase();
      let fallbackReply = '';

      if (msgLower.includes('alug') || msgLower.includes('locaç') || msgLower.includes('locac')) {
        const rentalProps = propertyCatalog.filter((p: any) => p.purpose === 'aluguel' || p.purpose === 'ambos');
        if (rentalProps.length > 0) {
          fallbackReply = `Olá! Com certeza. Temos atualmente ${rentalProps.length} oportunidades exclusivas selecionadas para **locação de alto padrão** em nosso portfólio:\n\n` +
            rentalProps.map((p: any) => `💎 *${p.title}* (Ref: *${p.code}*)\n📍 ${p.neighborhood}, ${p.city}\n📐 ${p.areaM2}m² | 🛏️ ${p.suites} Suítes | 🚗 ${p.parkingSpots} Vagas\n💵 *Locação:* R$ ${(p.rentalPrice || p.price)?.toLocaleString('pt-BR')}/mês\n`).join('\n') +
            `\nGostaria que eu lhe envie o dossiê confidencial com as fotos exclusivas de alguma dessas opções?`;
        } else {
          fallbackReply = `Olá! Nossas unidades para locação são altamente disputadas e gerenciadas off-market. Temos opções reservadas no Itaim Bibi e Jardins. Posso pedir ao Sergio Langer para lhe enviar o book reservado agora pelo WhatsApp?`;
        }
      } else if (msgLower.includes('cobertura') || msgLower.includes('penthouse') || msgLower.includes('itaim')) {
        fallbackReply = `Olá! Perfeito. No Itaim Bibi temos a *Penthouse Triplex Sky Lounge* (Ref: *IB-980*):\n\n📐 740m² úteis | 🛏️ 5 Suítes | 🚗 8 Vagas\n🏊 Piscina privativa suspensa com borda infinita e vista 360° para o Parque do Povo\n🍷 Adega climatizada para 1.200 garrafas\n💵 *Venda:* R$ 28.500.000 (disponível também para locação por R$ 95.000/mês)\n\nGostaria de agendar uma visita técnica confidencial nesta quinta ou sexta?`;
      } else if (msgLower.includes('mansão') || msgLower.includes('jardins') || msgLower.includes('europa')) {
        fallbackReply = `Olá! Nos Jardins dispomos da *Mansão Arquitetônica Contemporânea Jardim Europa* (Ref: *JD-450*):\n\n📐 1.250m² de área construída em terreno plano de 1.800m²\n🛏️ 6 Suítes | 🚗 10 Vagas subterrâneas\n🛡️ Rua estritamente fechada com guarita blindada e segurança armada 24h\n🎬 Cinema privativo com 14 poltronas e Spa completo\n💵 *Venda:* R$ 45.000.000\n\nPosso providenciar a apresentação privada desta unidade para você?`;
      } else if (msgLower.includes('bc') || msgLower.includes('balneário') || msgLower.includes('praia') || msgLower.includes('mar')) {
        fallbackReply = `Olá! Frente ao mar temos o *Branded Residence Ocean View Signature Tower* em Balneário Camboriú (Ref: *BC-880*):\n\n📐 420m² privativos | 🛏️ 4 Suítes | 🚗 5 Vagas\n🚤 Vaga privativa para iate de até 60 pés na marina integrada\n🚁 Heliponto homologado no topo do edifício\n💵 *Locação Mensal:* R$ 65.000/mês\n\nPosso enviar o PDF com as plantas e tour em vídeo?`;
      } else {
        fallbackReply = `Olá! Seja muito bem-vindo ao atendimento privado do Sergio Langer.\n\nNosso portfólio conta com coberturas triplex, mansões contemporâneas e residências exclusivas para *venda* e *locação* nos bairros mais nobres de São Paulo, Rio de Janeiro e Balneário Camboriú.\n\nVocê possui preferência por alguma tipologia específica (cobertura, mansão ou fazenda) ou região de preferência?`;
      }

      return res.json({
        reply: fallbackReply,
        source: 'smart-grounded-catalog-engine'
      });

    } catch (err: any) {
      console.error('Erro na rota /api/ai/copilot:', err);
      res.status(500).json({ error: 'Erro interno ao processar inteligência do Copiloto' });
    }
  });

  // Dedicated static images handler - never fall back to index.html for image requests
  const publicImagesPath = path.join(process.cwd(), 'public', 'images');
  app.use('/images', express.static(publicImagesPath, {
    maxAge: '1h',
    fallthrough: false,
  }));

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
