IF OBJECT_ID('tblSnakeScores') IS NULL
BEGIN
    CREATE TABLE [dbo].[tblSnakeScores](
        [Id] [int] IDENTITY(1,1>) NOT NULL PRIMARY KEY,
        [UserId] [int] NOT NULL FOREIGN KEY REFERENCES [dbo].[tblUsers](Id),
        [Score] [int] NOT NULL,
        [CreatedAt] [datetime] NOT NULL DEFAULT GETDATE()
    )
END


GO
