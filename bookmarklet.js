// Script para monitorar mudança de data usando iframe - VERSÃO CORRIGIDA
javascript:(function() {
    'use strict';
    
    // Configurações
    const INTERVAL_MS = 30000; // 30 segundos
    const TARGET_URL = 'https://diariooficial.to.gov.br/';
    const TARGET_DIV_ID = 'edicaodoe';
    
    // Variáveis globais para controlar som e animações
    let alertSoundInterval;
    let tabBlinkInterval;
    let backgroundBlinkInterval;
    let monitorInterval; // ÚNICO interval principal
    let iframe;
    let iframeContainer;
    let isMonitoring = false; // Flag para evitar execuções múltiplas
    
    // Função para obter a data atual no formato DD/MM/YYYY
    function getCurrentDate() {
        const now = new Date(2025, 8, 2);
        // const now = new Date();
        const day = String(now.getDate()).padStart(2, '0');
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const year = now.getFullYear();
        return `${day}/${month}/${year}`;
    }
    
    // Função para criar iframe visível ocupando 100% da tela
    function createVisibleIframe() {
        // Container principal - 100% da tela
        iframeContainer = document.createElement('div');
        iframeContainer.id = 'monitorContainer';
        iframeContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: #fff;
            z-index: 999997;
            display: flex;
            flex-direction: column;
        `;
        
        // Barra de título
        const titleBar = document.createElement('div');
        titleBar.style.cssText = `
            background: linear-gradient(90deg, #007acc, #005a9e);
            color: white;
            padding: 15px 20px;
            font-family: Arial, sans-serif;
            font-size: 16px;
            font-weight: bold;
            display: flex;
            justify-content: space-between;
            align-items: center;
            min-height: 50px;
        `;
        
        const titleText = document.createElement('span');
        titleText.textContent = `🔍 Monitorando: ${TARGET_URL} | Data atual: ${getCurrentDate()}`;
        
        const statusIndicator = document.createElement('span');
        statusIndicator.id = 'statusIndicator';
        statusIndicator.style.cssText = `
            background: #4caf50;
            color: white;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 14px;
            animation: pulse 2s infinite;
        `;
        statusIndicator.textContent = '🟢 INICIANDO...';
        
        titleBar.appendChild(titleText);
        titleBar.appendChild(statusIndicator);
        
        // Iframe
        iframe = document.createElement('iframe');
        iframe.id = 'monitorIframe';
        iframe.src = TARGET_URL;
        iframe.style.cssText = `
            flex: 1;
            border: none;
            width: 100%;
            height: calc(100% - 50px);
        `;
        
        // Adiciona elementos ao container
        iframeContainer.appendChild(titleBar);
        iframeContainer.appendChild(iframe);
        document.body.appendChild(iframeContainer);
        
        // Adiciona CSS para animação
        const style = document.createElement('style');
        style.textContent = `
            @keyframes pulse {
                0% { opacity: 1; }
                50% { opacity: 0.7; }
                100% { opacity: 1; }
            }
        `;
        document.head.appendChild(style);
        
        return iframe;
    }
    
    // Função para atualizar status na barra de título
    function updateStatus(status, color = '#4caf50') {
        const indicator = document.getElementById('statusIndicator');
        if (indicator) {
            indicator.textContent = status;
            indicator.style.background = color;
        }
    }
    
    // Função para extrair a data da div no iframe
    function getDateFromIframe() {
        try {
            const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
            const div = iframeDoc.getElementById(TARGET_DIV_ID);
            
            if (!div) {
                console.log('Div não encontrada no iframe:', TARGET_DIV_ID);
                updateStatus('❌ DIV NÃO ENCONTRADA', '#f44336');
                return null;
            }
            
            // Remove texto extra e pega apenas a data
            const text = div.textContent.trim();
            const dateMatch = text.match(/(\d{2}\/\d{2}\/\d{4})/);
            const foundDate = dateMatch ? dateMatch[1] : null;
            
            if (foundDate) {
                updateStatus(`📅 DATA: ${foundDate}`, '#2196f3');
            }
            
            return foundDate;
        } catch (error) {
            console.log('Erro ao acessar iframe (pode ser CORS):', error.message);
            updateStatus('⚠️ ERRO CORS', '#ff9800');
            return null;
        }
    }
    
    // Função para fazer a aba piscar
    function blinkTab() {
        const originalTitle = document.title;
        let blinking = true;
        
        tabBlinkInterval = setInterval(() => {
            document.title = blinking ? '🚨🚨🚨 ATENÇÃO! 🚨🚨🚨' : '⚠️⚠️⚠️ URGENTE! ⚠️⚠️⚠️';
            blinking = !blinking;
        }, 400);
    }
    
    // Função para reproduzir som de alerta persistente
    function startPersistentAlertSound() {
        const playAlarmSound = () => {
            try {
                const audioContext = new (window.AudioContext || window.webkitAudioContext)();
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                
                // Som mais alto e irritante
                oscillator.type = 'square'; // Som mais áspero
                oscillator.frequency.setValueAtTime(1000, audioContext.currentTime);
                oscillator.frequency.setValueAtTime(500, audioContext.currentTime + 0.2);
                oscillator.frequency.setValueAtTime(1200, audioContext.currentTime + 0.4);
                oscillator.frequency.setValueAtTime(700, audioContext.currentTime + 0.6);
                
                gainNode.gain.setValueAtTime(0.8, audioContext.currentTime); // Volume bem alto
                gainNode.gain.setValueAtTime(0.8, audioContext.currentTime + 0.8);
                
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.8);
            } catch (e) {
                console.log('Erro ao reproduzir som:', e);
            }
        };
        
        // Toca o som imediatamente
        playAlarmSound();
        
        // Continua tocando a cada 1.5 segundos
        alertSoundInterval = setInterval(playAlarmSound, 1500);
    }
    
    // Função para criar fundo piscante
    function createBlinkingBackground() {
        const overlay = document.createElement('div');
        overlay.id = 'blinkingOverlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            z-index: 999998;
            pointer-events: none;
            background: rgba(255, 0, 0, 0.3);
        `;
        
        document.body.appendChild(overlay);
        
        let isRed = true;
        backgroundBlinkInterval = setInterval(() => {
            overlay.style.background = isRed ? 
                'rgba(255, 165, 0, 0.4)' : // Laranja
                'rgba(255, 0, 0, 0.4)';    // Vermelho
            isRed = !isRed;
        }, 600);
        
        return overlay;
    }
    
    // Função para criar modal de alerta
    function showModal() {
        // Remove modal existente se houver
        const existingModal = document.getElementById('dateAlertModal');
        if (existingModal) {
            existingModal.remove();
        }
        
        // Cria fundo piscante primeiro
        const blinkingBg = createBlinkingBackground();
        
        // Cria o modal
        const modal = document.createElement('div');
        modal.id = 'dateAlertModal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: rgba(0, 0, 0, 0.8);
            z-index: 999999;
            display: flex;
            justify-content: center;
            align-items: center;
            font-family: Arial, sans-serif;
            animation: shake 0.5s infinite;
        `;
        
        const content = document.createElement('div');
        content.style.cssText = `
            background: linear-gradient(45deg, #ff0000, #ff4444);
            padding: 50px;
            border-radius: 20px;
            text-align: center;
            max-width: 600px;
            box-shadow: 0 20px 60px rgba(255,0,0,0.8);
            border: 5px solid #ffff00;
            animation: pulse 0.8s infinite;
        `;
        
        content.innerHTML = `
            <h1 style="color: white; font-size: 60px; margin: 0 0 30px 0; text-shadow: 3px 3px 6px #000;">
                🚨 ATENÇÃO! 🚨
            </h1>
            <h2 style="color: #ffff00; font-size: 32px; margin: 20px 0; text-shadow: 2px 2px 4px #000;">
                DATA ATUALIZADA!
            </h2>
            <p style="font-size: 28px; margin: 30px 0; color: white; text-shadow: 1px 1px 2px #000;">
                A data foi atualizada para <strong style="color: #ffff00;">${getCurrentDate()}</strong>!
            </p>
            <button id="closeModal" style="
                background: #ffff00;
                color: #000;
                border: 3px solid #ff0000;
                padding: 20px 40px;
                font-size: 24px;
                font-weight: bold;
                border-radius: 12px;
                cursor: pointer;
                margin-top: 30px;
                box-shadow: 0 8px 16px rgba(0,0,0,0.3);
                animation: buttonPulse 1s infinite;
            ">🔇 PARAR ALERTA!</button>
        `;
        
        modal.appendChild(content);
        document.body.appendChild(modal);
        
        // Adiciona animações CSS para o modal
        const modalStyle = document.createElement('style');
        modalStyle.textContent = `
            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                25% { transform: translateX(-5px); }
                75% { transform: translateX(5px); }
            }
            @keyframes buttonPulse {
                0% { transform: scale(1); box-shadow: 0 8px 16px rgba(0,0,0,0.3); }
                50% { transform: scale(1.1); box-shadow: 0 12px 24px rgba(255,255,0,0.6); }
                100% { transform: scale(1); box-shadow: 0 8px 16px rgba(0,0,0,0.3); }
            }
        `;
        document.head.appendChild(modalStyle);
        
        // Para todos os alertas quando clicar no botão
        document.getElementById('closeModal').onclick = () => {
            stopAllAlerts();
            modal.remove();
            blinkingBg.remove();
            document.title = document.title.replace(/🚨|⚠️|ATENÇÃO|URGENTE/g, '').trim() || 'Página';
        };
        
        // Impede fechar clicando fora (obriga a clicar no botão)
        modal.onclick = (e) => {
            e.stopPropagation();
        };
    }
    
    // Função para parar todos os alertas
    function stopAllAlerts() {
        if (alertSoundInterval) {
            clearInterval(alertSoundInterval);
            alertSoundInterval = null;
        }
        if (tabBlinkInterval) {
            clearInterval(tabBlinkInterval);
            tabBlinkInterval = null;
        }
        if (backgroundBlinkInterval) {
            clearInterval(backgroundBlinkInterval);
            backgroundBlinkInterval = null;
        }
    }
    
    // Função principal de alerta
    function triggerAlert() {
        console.log('🚨 DATA ATUAL DETECTADA! Acionando todos os alertas...');
        updateStatus('🚨 ALERTA ATIVO!', '#f44336');
        
        stopAllAlerts(); // Para alertas anteriores se existirem
        
        showModal();
        blinkTab();
        startPersistentAlertSound();
        
        // Vibração no celular (se suportado)
        if ('vibrate' in navigator) {
            navigator.vibrate([300, 200, 300, 200, 300, 200, 300]);
        }
    }
    
    // Função principal de verificação - SIMPLIFICADA
    function checkDate() {
        // Evita execuções múltiplas simultâneas
        if (isMonitoring) {
            console.log('⏳ Verificação já em andamento, pulando...');
            return;
        }
        
        isMonitoring = true;
        updateStatus('🔍 VERIFICANDO...', '#ff9800');
        
        const currentDate = getCurrentDate();
        const divDate = getDateFromIframe();
        
        console.log(`✅ Verificação única - Atual: ${currentDate}, Div: ${divDate}`);
        
        if (divDate && divDate === currentDate) {
            triggerAlert();
        } else {
            updateStatus('🟢 MONITORANDO', '#4caf50');
        }
        
        isMonitoring = false;
    }
    
    // Função para recarregar iframe - SIMPLIFICADA
    function reloadAndCheck() {
        console.log('🔄 Ciclo de monitoramento iniciado');
        updateStatus('🔄 RECARREGANDO...', '#ff9800');
        
        // Recarrega o iframe
        iframe.src = TARGET_URL + '?t=' + Date.now();
        
        // Aguarda carregar e verifica UMA ÚNICA VEZ
        setTimeout(() => {
            checkDate();
        }, 5000);
    }
    
    // Inicialização
    console.log('🔍 Iniciando monitoramento da data com iframe visível (100%)...');
    console.log(`URL: ${TARGET_URL}`);
    console.log(`Data atual: ${getCurrentDate()}`);
    console.log(`Verificando a cada ${INTERVAL_MS/1000} segundos`);
    
    // Para qualquer monitoramento anterior
    if (window.stopDateMonitor) {
        window.stopDateMonitor();
    }
    
    // Cria o iframe visível
    createVisibleIframe();
    
    // Primeira verificação após carregar
    iframe.onload = () => {
        console.log('✅ Iframe carregado!');
        updateStatus('✅ CARREGADO', '#4caf50');
        setTimeout(checkDate, 2000);
    };
    
    // ÚNICO interval principal - sem acumulação
    monitorInterval = setInterval(reloadAndCheck, INTERVAL_MS);
    
    // Adiciona função global para parar o monitoramento
    window.stopDateMonitor = () => {
        console.log('🛑 Parando monitoramento...');
        
        if (monitorInterval) {
            clearInterval(monitorInterval);
            monitorInterval = null;
        }
        
        stopAllAlerts();
        
        if (iframeContainer) {
            iframeContainer.remove();
        }
        
        isMonitoring = false;
        console.log('⏹️ Monitoramento completamente interrompido');
    };
    
    // Função para ocultar/mostrar iframe
    window.toggleIframe = () => {
        if (iframeContainer) {
            const isVisible = iframeContainer.style.display !== 'none';
            iframeContainer.style.display = isVisible ? 'none' : 'flex';
            console.log(isVisible ? '👁️ Iframe ocultado' : '👁️ Iframe exibido');
        }
    };
    
    console.log('✅ Script de monitoramento ativo!');
    console.log('📋 Comandos disponíveis:');
    console.log('   - stopDateMonitor() → Para o monitoramento');
    console.log('   - toggleIframe() → Oculta/mostra o iframe');
    
})();
