-- LUXX MOTORS - CONSULTAS DE VERIFICACAO (APENAS LEITURA)
-- Banco: LuxMotors | Microsoft SQL Server
-- Estes comandos nao alteram os dados.

USE LuxMotors;
GO

-- 1. Catalogo de veiculos (40 registros observados nos testes)
SELECT TOP (100) * FROM dbo.Veiculo ORDER BY Id_veiculo DESC;
GO

-- 2. Agendamento criado pelo iPhone e validado no SQL Server
-- Protocolo registrado no teste: 16
SELECT * FROM dbo.TestDrive WHERE Id_testedrive = 16;
GO

-- 3. Proposta criada pelo iPhone e validada no SQL Server
-- Protocolo registrado no teste: 12
SELECT * FROM dbo.Financiamento WHERE Id_financiamento = 12;
GO

-- 4. Consultas gerais, somente leitura
SELECT TOP (30) * FROM dbo.Cliente;
SELECT TOP (30) * FROM dbo.Vendedor;
SELECT TOP (30) * FROM dbo.Revisao;
SELECT TOP (30) * FROM dbo.Vendas;
GO
