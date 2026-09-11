IF OBJECT_ID('tblUsers') IS NULL
BEGIN
    CREATE TABLE [dbo].[tblUsers](
        [Id] [int] IDENTITY(1,1) NOT NULL PRIMARY KEY,
        [Username] [nvarchar](50) NOT NULL UNIQUE,
        [Email] [nvarchar](255) NOT NULL UNIQUE,
        [PasswordHash] [nvarchar](255) NOT NULL,
        [IsActive] [bit] NOT NULL DEFAULT 1,
        [CreatedAt] [datetime] NOT NULL DEFAULT GETDATE()
    )
END


GO
