import matplotlib.pyplot as plt
from .graph_strategy import GraphStrategy


class TemperatureGraphStrategy(GraphStrategy):
    def generate_graph(self, data):
        """
        Gera um gráfico de temperatura com previsões de 5 dias.
        :param data: Dicionário com 'dates' e 'temperatures'.
        """
        dates = data["dates"]
        temperatures = data["temperatures"]

        plt.figure(figsize=(10, 6))
        plt.plot(dates, temperatures, marker="o", color="red")
        plt.title("Previsão de Temperatura - Próximos 5 Dias")
        plt.xlabel("Data")
        plt.ylabel("Temperatura (°C)")
        plt.xticks(rotation=45)
        plt.grid(True)
        plt.tight_layout()
        plt.show()
