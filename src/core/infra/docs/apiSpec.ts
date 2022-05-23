export default {
    openapi: "3.0.0",
    info: {
        title: "API da Lista de Recados",
        description: "API utilizada no projeto de avaliação Sistema Lista de Recados", 
        version: "1.0.0"
    },
    schemes: ["http", "https"],
    components: {
        securitySchemes:{
            bearerAuth:{
                type: "http",
                scheme: "bearer",
                bearerFormat: "JWT"
            }
        },
        schemas: {
            IUser: {
                type: "object",
                required: ["username", "password"],
                properties: {
                    username: {
                        summary: "Nome de Usuario",
                        type: "string",
                        example: "JoaoZelito"
                    },
                    password: {
                        summary: "Senha do Usuario",
                        type: "string",
                        example: "Recados2022."
                    }
                }
            },
            INote: {
                type: "object",
                required: ["title", "details"],
                properties: {
                    uid: {
                        type: "string"
                    },
                    title: {
                        type: "string",
                        example: "Um Recadinho."
                    },
                    details: {
                        type: "string",
                        example: "Para você lembrar de entregar o trabalho no prazo."
                    },
                    created_at: {
                        type: "string"
                    }
                }
            }
        },
        responses: {}
    },
    paths: {
        // /auth POST
        "/auth": {
            summary: "Rota de autenticação do sistema",
            post: {
                description: "Realiza uma tentativa de autenticação no sistema",
                tags: ["Auth Feature"],
                parameters: [
                ],
                requestBody: {
                    description: "",
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/IUser"
                            },
                            example: {
                                username: "Joselito",
                                password: "EntregaAtrasada."
                            }
                        },
                    },
                    required: true
                },
                responses: {
                    200: {
                        description: "Logon realizado com sucesso, retorna token",
                        content: {
                            "application/json": {
                                schema: {},
                                example: {
                                    msg: "LogonSuccessful",
                                    data: "long-jwt-token"
                                }
                            }
                        }
                    },
                    409: {
                        description: "Falha no logon por credencial incorreta",
                        content: {
                            "application/json": {
                                schema: {},
                                example: {
                                    msg: "InvalidCredentialsError",
                                    data: "invalid credentials provided."
                                  }
                            }
                        }
                    }
                }
            }
        },
        "/user": {
            summary: "Rota de criação de usuário do sistema",
            post: {
                description: "Realiza uma tentativa de criação de usuário no sistema",
                tags: ["User Feature"],
                parameters: [
                ],
                requestBody: {
                    description: "",
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/IUser"
                            },
                            example: {
                                username: "Joselito",
                                password: "EntregaAtrasada."
                            }
                        },
                    },
                    required: true
                },
                responses: {
                    200: {
                        description: "Logon realizado com sucesso, retorna usuário",
                        content: {
                            "application/json": {
                                schema: {},
                                example: {
                                    msg: "UserCreated",
                                    data: "long-jwt-token"
                                }
                            }
                        }
                    },
                    409: {
                        description: "Falha no criação, usuário já existe",
                        content: {
                            "application/json": {
                                schema: {},
                                example: {
                                    msg: "UserAlreadyExistsError",
                                    data: "UserAlreadyExists"
                                  }
                            }
                        }
                    },
                    400: {
                        description: "Falha na criação, senha ou usuário excede limite de caractéres",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    required: ["msg", "data"],
                                    properties: {
                                        username: {
                                            summary: "Nome da classe de erro",
                                            type: "string"
                                        },
                                        password: {
                                            summary: "Erro detalhado",
                                            type: "string"
                                        }
                                    }
                                },
                                example: {
                                    senha: {
                                        msg: "PasswordLengthError",
                                        data: "Password excede 36 caracteres."
                                    },
                                    usuario: {
                                        msg: "UsernameLengthError",
                                        data: "Username excede 36 caracteres."
                                    }
                                  },

                            }
                        }
                    }
                }
            }
        },
        "/note": {
            summary: "Rota de manipulação da lista de recados do sistema",
            security: {
                bearerAuth: []
            },
            post: {
                description: "Realiza a criação de um novo recado",
                tags: ["Note Feature"],
                parameters: [
                ],
                requestBody: {
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/INote"
                            },
                            example: {
                                title: "Um tiulo",
                                details: "De um Grande e improtante Recado"
                            }
                        },
                    },
                    required: true
                },
                responses: {
                    200: {
                        description: "Novo Recado criado com sucesso",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    required: ["msg"],
                                    properties:{
                                        msg: {type: "string"},
                                        data: {
                                            $ref: "#/components/schemas/INote",
                                        }
                                    }
                                },
                                example: {
                                    msg: "NoteCreated",
                                    data: {
                                        uid: "8e7f627b-94e4-43ee-9f45-0d90a18a1e67",
                                        title: "Lembre-se",
                                        details: "Que o prazo esta acabando",
                                        created_at: "2022-05-23T00:18:57.552Z"
                                    }
                                }
                            }
                        }
                    },
                }
            },
            put: {
                description: "Realiza a alteração de um recado existente",
                tags: ["Note Feature"],
                parameters: [
                    {
                        name: "uid",
                        in: "path",
                        description: "Uid do Recado específico a ser alterado",
                        required: true
                    }
                ],
                requestBody: {
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/INote"
                            },
                            example: {
                                title: "Um tiulo",
                                details: "De um Grande e improtante Recado"
                            }
                        },
                    },
                    required: true
                },
                responses: {
                    200: {
                        description: "Recado atualizado com sucesso, retorna novo recado",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    required: ["msg"],
                                    properties:{
                                        msg: {type: "string"},
                                        data: {
                                            $ref: "#/components/schemas/INote",
                                        }
                                    }
                                },
                                example: {
                                    msg: "NoteEdited",
                                    data: {
                                        "uid": "8e7f627b-94e4-43ee-9f45-0d90a18a1e67",
                                        "title": "Olha só",
                                        "details": "O deploy em produção",
                                        "created_at": "2022-05-23T00:18:57.552Z"
                                    }
                                }
                            }
                        }
                    },
                }
            },
            get: {
                description: "Realiza a requisição de todos ou um recado específico",
                tags: ["Note Feature"],
                parameters: [
                    {
                        name: "uid",
                        in: "path",
                        description: "Uid do Recado específico a ser consultado, retorna todos os recados quando não informado.",
                        required: false
                    }
                ],
                responses: {
                    200: {
                        description: "Resultado da View solicitada",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    required: ["msg", "data"],
                                    properties:{
                                        msg: {type: "string"},
                                        data: {
                                            type: "array",
                                            items: {$ref: "#/components/schemas/INote"}
                                        }
                                    }
                                },
                                example: {
                                    "msg": "NoteView",
                                    "data": [
                                        {
                                            "uid": "3ec3315e-8a2f-4620-b317-0260220b8c9c",
                                            "title": "Olha só",
                                            "details": "O deploy em produção",
                                            "created_at": "2022-05-23T00:21:01.983Z"
                                        },
                                        {
                                            "uid": "3ec3315e-8a2f-4620-b317-0260220b8c9c",
                                            "title": "Titulo do Recado",
                                            "details": "Detalhes do Recado",
                                            "created_at": "2022-05-23T00:21:01.983Z"
                                        },
                                    ]
                                }
                            }
                        }
                    },
                }
            },
            delete: {
                description: "Realiza a remoção de um recado existente",
                tags: ["Note Feature"],
                parameters: [
                    {
                        name: "uid",
                        in: "path",
                        description: "Uid do Recado específico a ser deletado",
                        required: true
                    }
                ],
                responses: {
                    200: {
                        description: "Recado deletado com sucesso",
                        content: {
                            "application/json": {
                                schema: {},
                                example: {
                                    msg: "NoteDeleted",
                                    data: {
                                        "affected": 1
                                    }
                                }
                            }
                        }
                    },
                }
            }
        }
    }
}