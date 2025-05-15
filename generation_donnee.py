import pandas as pd
import numpy as np
import random

# Paramètres de génération
annees = [2019, 2020, 2021, 2022, 2023]
mois = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre']
regions = ['Antananarivo', 'Nosy Be', 'Sainte Marie', 'Diego Suarez', 'Toliara', 'Mahajanga']
sous_regions = {
    'Antananarivo': ['Analamanga'],
    'Nosy Be': ['Diana'],
    'Sainte Marie': ['Analanjirofo'],
    'Diego Suarez': ['Diana'],
    'Toliara': ['Atsimo-Andrefana'],
    'Mahajanga': ['Boeny']
}
villes = {
    'Antananarivo': ['Antananarivo'],
    'Nosy Be': ['Andilana', 'Ambatoloaka'],
    'Sainte Marie': ['Sainte Marie'],
    'Diego Suarez': ['Diego Suarez'],
    'Toliara': ['Ifaty'],
    'Mahajanga': ['Antanimalandy']
}
pays_origine = ['France', 'Italie', 'Allemagne', 'USA', 'Chine', 'Afrique du Sud']
motifs_visite = ['Loisirs', 'Plage', 'Aventure', 'Culture', 'Affaires']
types_transport = ['Avion', 'Bateau', '4x4', 'Bus']
types_hebergement = ['Hôtel', 'Resort', 'Auberge', 'Maison_Hôte']

# Nombre de lignes à générer
n_rows = 100000

# Génération des données
data = []
for _ in range(n_rows):
    annee = random.choice(annees)
    mois_val = random.choice(mois)
    region = random.choice(regions)
    sous_region = random.choice(sous_regions[region])
    ville = random.choice(villes[region])
    pays = random.choice(pays_origine)
    motif = random.choice(motifs_visite)
    transport = random.choice(types_transport)
    hebergement = random.choice(types_hebergement)
    arrivees = max(100, int(np.random.normal(2000, 800)))  # Éviter les valeurs trop petites
    depenses = max(500, int(np.random.normal(1000, 300)))
    duree = max(3, int(np.random.normal(10, 5)))
    satisfaction = round(random.uniform(3.5, 5), 1)
    environnement = round(random.uniform(3.0, 4.8), 1)
    emplois_d = max(10, int(np.random.normal(50, 20)))
    emplois_i = emplois_d * random.randint(2, 4)
    pib = round(random.uniform(0.0005, 0.005), 4)

    data.append([annee, mois_val, region, sous_region, ville, pays, motif, transport, hebergement, arrivees, depenses, duree, satisfaction, environnement, emplois_d, emplois_i, pib])

# Création du DataFrame et sauvegarde en CSV
df = pd.DataFrame(
    data,
    columns=[
        'Année', 'Mois', 'Région', 'Sous_Région', 'Ville', 'Pays_Origine',
        'Motif_Visite', 'Type_Transport', 'Type_Hébergement', 'Nombre_Arrivées',
        'Dépenses_Moyennes', 'Durée_Séjour', 'Satisfaction_Client',
        'Note_Environnement', 'Emplois_Directs', 'Emplois_Indirects', 'PIB_Contribution'
    ]
)
df.to_csv('tourisme_madagascar.csv', index=False)

print("Fichier CSV 'tourisme_madagascar.csv' généré avec succès!")