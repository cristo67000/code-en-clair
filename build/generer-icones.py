# -*- coding: utf-8 -*-
"""Génère les icônes et l'image d'aperçu de Code en clair.

Dessin : deux accolades « { } » crème sur le bleu nuit de l'application, avec
en dessous le trait vert d'un curseur de terminal — le signe du code, et de ce
qu'on écrit dedans. Rien d'autre : à 48 pixels sur un écran de téléphone, tout
détail supplémentaire devient une tache.

Dessiné au quadruple de la taille finale puis réduit : Pillow ne lisse pas les
bords, le suréchantillonnage s'en charge.

    python build/generer-icones.py
"""
import os

from PIL import Image, ImageDraw, ImageFont

ICI = os.path.dirname(os.path.abspath(__file__))
SORTIE = os.path.join(os.path.dirname(ICI), "icons")

NUIT = (22, 33, 62)
CREME = (244, 246, 251)
VERT = (94, 224, 160)
BLEU = (143, 176, 255)
E = 4

POLICES_GRASSES = [r"C:\Windows\Fonts\consolab.ttf", r"C:\Windows\Fonts\lucon.ttf",
                   "/usr/share/fonts/truetype/dejavu/DejaVuSansMono-Bold.ttf"]
POLICES = [r"C:\Windows\Fonts\segoeui.ttf", r"C:\Windows\Fonts\arial.ttf",
           "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"]


def police(taille, grasse=True):
    for chemin in (POLICES_GRASSES if grasse else POLICES):
        if os.path.exists(chemin):
            return ImageFont.truetype(chemin, taille)
    return ImageFont.load_default()


def icone(cote, masquable=False):
    grand = cote * E
    image = Image.new("RGB", (grand, grand), NUIT)
    dessin = ImageDraw.Draw(image)
    # Une icône « masquable » peut être rognée en cercle : tout doit tenir
    # dans les 80 % du centre.
    echelle = 0.44 if masquable else 0.58
    f = police(int(grand * echelle))
    # Les deux accolades, écartées, avec entre elles le trait vert d'un
    # curseur de terminal posé sur la ligne de base : « {▂} ».
    g = dessin.textbbox((0, 0), "{", font=f)
    d = dessin.textbbox((0, 0), "}", font=f)
    hauteur = g[3] - g[1]
    ecart = grand * (0.245 if masquable else 0.30)          # demi-distance entre les deux
    y = (grand - hauteur) / 2 - g[1]
    xg = grand / 2 - ecart - (g[2] - g[0]) / 2 - g[0]
    xd = grand / 2 + ecart - (d[2] - d[0]) / 2 - d[0]
    dessin.text((xg, y), "{", font=f, fill=CREME)
    dessin.text((xd, y), "}", font=f, fill=CREME)
    epaisseur = max(2, int(grand * 0.05))
    longueur = grand * (0.15 if masquable else 0.20)
    trait_y = y + g[1] + hauteur * 0.74
    x0 = (grand - longueur) / 2
    dessin.rounded_rectangle([x0, trait_y, x0 + longueur, trait_y + epaisseur],
                             radius=epaisseur // 2, fill=VERT)
    return image.resize((cote, cote), Image.LANCZOS)


def apercu():
    """L'image qu'affichent les messageries quand on partage le lien."""
    l, h = 1200, 630
    image = Image.new("RGB", (l * 2, h * 2), NUIT)
    dessin = ImageDraw.Draw(image)
    logo = icone(360).resize((520, 520), Image.LANCZOS)
    image.paste(logo, (150, (h * 2 - 520) // 2))
    titre = police(150)
    dessin.text((780, 330), "Code en clair", font=titre, fill=CREME)
    sous = police(60, grasse=False)
    lignes = ["Le glossaire du codage, FR · EN",
              "Git · web · terminal · sécurité · IA",
              "schémas · exemples · notes · quiz"]
    for i, ligne in enumerate(lignes):
        dessin.text((790, 560 + i * 92), ligne, font=sous, fill=CREME if i == 0 else BLEU)
    return image.resize((l, h), Image.LANCZOS)


def main():
    os.makedirs(SORTIE, exist_ok=True)
    icone(192).save(os.path.join(SORTIE, "icon-192.png"), optimize=True)
    icone(512).save(os.path.join(SORTIE, "icon-512.png"), optimize=True)
    icone(512, masquable=True).save(os.path.join(SORTIE, "icon-maskable-512.png"), optimize=True)
    apercu().save(os.path.join(SORTIE, "apercu-1200x630.png"), optimize=True)
    print("icônes écrites dans", SORTIE)


if __name__ == "__main__":
    main()
