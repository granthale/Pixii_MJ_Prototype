class Config(object):
    DEBUG = True
    TESTING = False

class DevelopmentConfig(Config):
    SECRET_KEY = 'jhfduhfd8754827ywehujkfh977428T%^#@#TYHGF55t7yhlgjhhsddfda'
    OPENAI_KEY = 'sk-get-your-api-key-from-openai-kuhruiyytyir8w750475yturhf'

config = {
    'development': DevelopmentConfig,
    'testing': DevelopmentConfig,
    'production': DevelopmentConfig
}