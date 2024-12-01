class WeatherGraph:
    def __init__(self, strategy):
        """
        Inicializa o contexto com uma estratégia específica.
        :param strategy: Instância de uma classe que implementa GraphStrategy.
        """
        self.strategy = strategy

    def set_strategy(self, strategy):
        """
        Altera a estratégia em tempo de execução.
        :param strategy: Nova instância de GraphStrategy.
        """
        self.strategy = strategy

    def generate(self, data):
        """
        Gera o gráfico usando a estratégia atual.
        :param data: Dados a serem processados pela estratégia.
        """
        self.strategy.generate_graph(data)
