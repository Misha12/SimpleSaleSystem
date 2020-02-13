CREATE TABLE Products (
	[ID] INT PRIMARY KEY IDENTITY(1, 1),
	[Name] varchar(100) not null,
	[Volume] varchar(50) not null,
	[CanSell] bit not null constraint [df_products_cansell] default(0),
	[Price] decimal not null
);

create table Orders (
	[ID] int primary key identity(1, 1),
	[ProductID] int not null,
	[Amount] float not null,
	[CancelledAt] datetime null,
	
	constraint [fk_product_id] foreign key ([ProductID]) references Products([ID])
);