# Monitor de Data - Diário Oficial TO

Este repositório contém um script avançado para monitorar mudanças de data no Diário Oficial do Tocantins com alertas visuais e sonoros.

## 📋 Funcionalidades

- ✅ **Monitoramento em tempo real** da página do Diário Oficial TO
- 🖥️ **Interface visual completa** ocupando 100% da tela
- 🔄 **Recarregamento automático** da página a cada 30 segundos
- 🚨 **Alertas múltiplos** quando detecta mudança para a data atual:
  - Modal de alerta vermelho piscante
  - Som de alarme persistente
  - Título da aba piscando
  - Fundo da tela piscante
  - Vibração no celular (se suportado)
- 📊 **Barra de status** com indicadores em tempo real
- 🎛️ **Controles para parar/ocultar** o monitoramento

## 🎯 Como Usar

### Opção 1: Script Direto (Recomendado)

1. Acesse qualquer página web
2. Abra o Console do Desenvolvedor (F12)
3. Cole o código do arquivo `monitor-script.js`
4. Pressione Enter

### Opção 2: Bookmarklet (Acesso Rápido)

1. Copie o código completo do arquivo `bookmarklet.js`
2. Crie um novo favorito no seu navegador
3. Cole o código na URL do favorito
4. Clique no favorito para ativar

## ⚙️ Configurações

No início do script você pode ajustar:

```javascript
const INTERVAL_MS = 30000; // Intervalo de verificação (30 segundos)
const TARGET_URL = 'https://diariooficial.to.gov.br/'; // URL monitorada
const TARGET_DIV_ID = 'edicaodoe'; // ID do elemento que contém a data
```

## 🎮 Comandos Disponíveis

Após executar o script, você terá acesso a:

```javascript
stopDateMonitor()  // Para completamente o monitoramento
toggleIframe()     // Oculta/mostra a interface de monitoramento
```

## 📱 Interface

O script cria uma interface completa com:

- **Barra de título**: Mostra URL monitorada e data atual
- **Indicador de status**: 
  - 🟢 MONITORANDO (normal)
  - 🔍 VERIFICANDO (durante checagem)
  - 🔄 RECARREGANDO (atualizando página)
  - ❌ DIV NÃO ENCONTRADA (erro)
  - ⚠️ ERRO CORS (problema de acesso)
  - 🚨 ALERTA ATIVO! (data detectada)
- **Iframe**: Exibe a página monitorada em tempo real

## 🚨 Sistema de Alertas

Quando a data atual é detectada, o script ativa:

1. **Modal de emergência** - Tela vermelha com botão para parar
2. **Som de alarme** - Bipe persistente a cada 1.5 segundos  
3. **Título piscante** - Alterna entre "🚨🚨🚨 ATENÇÃO!" e "⚠️⚠️⚠️ URGENTE!"
4. **Fundo piscante** - Alternância vermelho/laranja
5. **Vibração móvel** - Se o dispositivo suportar

## 🛡️ Recursos de Segurança

- **Prevenção de execução múltipla** - Evita sobrecarregar o sistema
- **Limpeza automática** - Remove intervalos anteriores ao reiniciar
- **Tratamento de erros CORS** - Detecta problemas de acesso
- **Botão de emergência** - Para todos os alertas instantaneamente

## 📋 Diferenças Entre Arquivos

### `monitor-script.js`
- Script completo para monitoramento do Diário Oficial TO
- Interface visual ocupando toda a tela
- Sistema completo de alertas
- Para usar no console do navegador

### `bookmarklet.js`  
- Versão compacta para favoritos
- Alerta simples sobre datas
- Configurável para qualquer data
- Inicia com `javascript:`

## 🔧 Solução de Problemas

**"DIV NÃO ENCONTRADA"**: O elemento com ID `edicaodoe` não existe na página

**"ERRO CORS"**: Política de segurança impede acesso ao iframe. Solução:
- Use uma extensão para desabilitar CORS temporariamente
- Execute em ambiente de desenvolvimento local

**Alertas não param**: Use o comando `stopDateMonitor()` no console

## ⚠️ Importante

- Este script foi desenvolvido especificamente para o site do Diário Oficial TO
- Requer permissões para reproduzir som automático
- Pode consumir recursos do sistema durante monitoramento prolongado
- Teste sempre antes de usar em ambiente de produção

## 📞 Suporte

Para dúvidas ou problemas:
1. Verifique as configurações no início do script
2. Teste os comandos de controle disponíveis
3. Abra uma issue neste repositório

---

**Desenvolvido para monitoramento eficiente do Diário Oficial TO** 🎯
