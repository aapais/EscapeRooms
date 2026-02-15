# Requisitos Técnicos — Workshop "Legacy Escape Room" com GitHub Copilot

Para garantir o sucesso da sessão (60-90 min) e evitar bloqueios técnicos no dia, cada participante necessita de uma estação de trabalho configurada com os seguintes requisitos.

## 1. Hardware e Sistema Operativo
- **Laptop:** Windows 10/11, macOS ou Linux.
- **Permissões:** Idealmente, direitos de administrador local para instalar dependências de última hora (opcional se o software abaixo já estiver instalado).

## 2. Software Necessário (Pré-instalado)
O seguinte software deve estar instalado e funcional na linha de comandos (Path configurado):

1.  **Node.js (LTS)**
    - Versão: 18.x ou 20.x
    - Comando para testar: `node -v` e `npm -v`
2.  **Git**
    - Comando para testar: `git --version`
3.  **Visual Studio Code (VS Code)**
    - Versão recente.
    - [Download](https://code.visualstudio.com/)

## 3. Extensões VS Code (Obrigatórias)
Devem ser instaladas no VS Code antes da sessão:
1.  **GitHub Copilot** (ID: `GitHub.copilot`)
2.  **GitHub Copilot Chat** (ID: `GitHub.copilot-chat`)

## 4. Acessos de Rede e Proxies (Crítico)
Como o workshop utiliza IA na cloud e descarrega pacotes, a rede corporativa (VPN/Zscaler/Proxy) deve permitir tráfego para:

-   **GitHub.com**: Acesso via HTTPS (porta 443) para clonar repositórios.
-   **NPM Registry**: Acesso a `https://registry.npmjs.org/` para instalar dependências (`npm install`).
-   **Endpoints do Copilot**: O firewall **não deve bloquear** nem fazer **inspeção SSL** (SSL break-and-inspect) aos seguintes domínios, caso contrário o Copilot não funcionará:
    -   `https://api.github.com`
    -   `https://copilot-proxy.githubusercontent.com`
    -   `https://default.exp-tas.com`
    -   Para lista completa ver: [Documentação GitHub Copilot Firewall](https://docs.github.com/en/copilot/troubleshooting-github-copilot/troubleshooting-network-errors-for-github-copilot)

> **Nota sobre Certificados:** Se a empresa usa proxies que intercetam SSL, certifique-se de que os certificados de raiz (CA) estão propagados para o `git` e `node`, ou forneça instruções para configurar (`NODE_EXTRA_CA_CERTS` ou `git config http.sslBackend`).

## 5. Licenças e Contas
-   **Conta GitHub:** Cada participante deve ter uma conta GitHub (pessoal ou empresarial).
-   **Licença Copilot:** A conta GitHub usada deve ter uma licença de Copilot ativa (Business, Enterprise ou Individual).
    - *Se a empresa não fornecer licenças:* Os participantes devem ativar o Trial de 30 dias do Copilot Individual antes da sessão.

## 6. Opcional (Recomendado para a Sala Final)
-   **Docker Desktop** (ou similar): Para correr containers e testar a modernização final.
    - Se não for permitido, os participantes conseguem completar 90% do desafio, mas não conseguirão validar a "Room Final / Containerização".

---
**Teste de Conectividade Rápido (Pre-flight Check)**
Pedir aos participantes para correrem isto no terminal 1 dia antes:
```bash
git clone https://github.com/aapais/EscapeRooms.git
cd legacy-escape-room
npm install
npm test
```
Se isto funcionar sem erros de rede/SSL, estão prontos.
