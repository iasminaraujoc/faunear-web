# Faunear Web

### 1. Membros do grupo
- Gabriel Franco Jallais
- Gustavo de Oliveira Severino
- Iasmin Correa Araujo
- Lucas Andre dos Santos


### 2. Definição do sistema 
O Faunear Web é um sistema responsável por gerenciar informações das espécies de animais em extinção no mundo, contribuindo para a conscientização ambiental. Dentre as responsabilidades dele, podem, ser citadas: 

- Gestão de dados, por meio de um CRUD das espécies (cadastrar novas espécies em extinção, listar os animais cadastrados, atualizar informações e remover animais que saiam da lista de extintos);
- Integração com APIs externas para atualização das informações;
- Filtragem dos dados: ao exibir os animais cadastrados, possibilitar a consulta através de informações distintas, como *habitat*, categoria taxonômica e nível de ameaça da extinção;

A ideia da aplicação foi inspirada em um sistema mobile de um dos integrantes do grupo. Assim, temos como objetivo adaptar o sistema já existente para, ao invés de ser feito para mobile, poder ser utilizado através da web. Esperamos que, com o desenvolvimento desta adaptação, possamos utilizar os testes de software para auxiliarem na criação e evolução do código.

### 3. Possíveis tecnologias utilizadas
- Linguagem: TypeScript
- Frameworks: Express.js e Pico.css
- Bibliotecas importantes: Handlebars e HTMX
- Banco de dados: SQLite
- Frameworks de teste utilizados: Vitest (testes de unidade e integração para TypeScript) e Playwright (testes E2E para frontend com HTMX)

### 4. Como rodar o projeto
1. Instale as dependências:
   - `npm install`
2. Execute as migrations:
   - `npm run db:migrate`
3. Popule o banco de dados inicial (opcional):
   - `npm run db:seed`
4. Executar em desenvolvimento:
   - `npm run dev`

### 5. Como rodar os testes
- Testes unitários e de integração:
  - `npm test`
- Testes com cobertura:
  - `npm run test:coverage`
- Testes E2E:
  - `npm run test:e2e`
- Pipeline completo de CI:
  - `npm run test:ci`

### 6. Integração contínua
O projeto usa GitHub Actions em `.github/workflows/ci.yml` para rodar testes e enviar relatórios de cobertura ao Codecov.
