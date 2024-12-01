import matplotlib.pyplot as plt
from .graph_strategy import GraphStrategy


class PrecipitationGraphStrategy(GraphStrategy):
    def generate_graph(self, data):
        """
        Gera um gráfico de precipitação ao longo do ano.
        :param data: Lista de precipitações mensais (em mm).
        """
        months = range(1, 13)  # Meses do ano
        plt.bar(months, data, color="blue")
        plt.title("Precipitação Mensal ao Longo do Ano")
        plt.xlabel("Mês")
        plt.ylabel("Precipitação (mm)")
        plt.grid(axis="y")
        plt.show()
