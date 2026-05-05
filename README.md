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
- Frameworks de teste utilizados: Vitest(testes de unidade e integração para TypeScript) e PlayWright (testes E2E para frontend com HTMX)
