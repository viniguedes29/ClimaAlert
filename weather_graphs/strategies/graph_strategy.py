from abc import ABC, abstractmethod


class GraphStrategy(ABC):
    @abstractmethod
    def generate_graph(self, data):
        """
        Gera um gráfico com base nos dados fornecidos.
        :param data: Dados para gerar o gráfico.
        """
        pass
