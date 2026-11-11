if not exists (select name from sys.databases where name = 'banco_luxx')
begin
    create database banco_luxx;
END
GO


use banco_luxx;
GO

SELECT id_veiculo, status, preco
FROM VEICULO
WHERE status = 'vendido';

UPDATE VEICULO 
SET Imagem = 'peugeot-308.webp' 
WHERE Imagem = 'peugeot-3089.webp';

EXEC sp_rename 'VENDEDOR.Cargo', 'cargo', 'COLUMN';




select * from vendas;