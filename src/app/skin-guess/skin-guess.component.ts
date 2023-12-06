import { Component, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Skin } from "../skin";
import {catchError, lastValueFrom, map, Observable, of} from "rxjs";
import { FormControl } from '@angular/forms';
import { startWith, debounceTime, switchMap, filter, distinctUntilChanged } from 'rxjs/operators';
import {VictoryDialogComponent} from "../victory-dialog/victory-dialog.component";
import { MatDialog } from '@angular/material/dialog';
import {Weapon} from "../weapon";
import {Category} from "../category";
import {Rarity} from "../rarity";
import {Collection} from "../Collection";


@Component({
  selector: 'app-skin-guess',
  templateUrl: './skin-guess.component.html',
  styleUrls: ['./skin-guess.component.css']
})
export class SkinGuessComponent implements OnInit {
  test = "test";
  skins: Skin[] | undefined = [];
  skin: Skin | undefined;
  myControl: FormControl = new FormControl();
  filteredSkins: Observable<Skin[]> | undefined;
  skinsGuess: Skin[] = [];

  formData: string | undefined; // Ajoutez une propriété pour stocker les données du formulaire
  trouver: boolean = false;

  constructor(private http: HttpClient, public dialog: MatDialog) {}


  getSkin(): Observable<Skin[]> {
    const url = `https://bymykel.github.io/CSGO-API/api/fr/skins.json`;
    return this.http.get<Skin[]>(url);
  }

  async ngOnInit() {
    try {
      this.skins = await lastValueFrom(this.getSkin());
      if (this.skins.length > 0) {
        const random = Math.floor(Math.random() * this.skins.length);
        this.skin = this.skins[random];
        console.log(this.skin);
      }
    } catch (error) {
      console.error('Une erreur s\'est produite lors de la récupération des skins:', error);
    }

    // Filtrer les skins en fonction de la valeur entrée dans le champ d'entrée
    this.filteredSkins = this.myControl.valueChanges.pipe(
      startWith(''), // Commence avec une chaîne vide
      debounceTime(300), // Délai de déclenchement
      distinctUntilChanged(), // Éviter les doublons
      switchMap(value => this.filterSkins(value)) // Appel de la fonction de filtrage
    );
  }

  filterSkins(value: string): Observable<Skin[]> {
    return of(this.skins || []).pipe(
      map(skins => {
        // Filtrer les skins en fonction de la valeur entrée
        const filteredSkins = skins.filter(skin => skin.name.toLowerCase().normalize("NFKD").replace(/\p{Diacritic}/gu, "").includes(value.toLowerCase().normalize("NFKD").replace(/\p{Diacritic}/gu, "")));

        // Retirer les skins déjà trouvés de l'auto-complétion
        const availableSkins = filteredSkins.filter(skin => !this.skinAlreadyGuessed(skin));
        return availableSkins;
      })
    );
  }

  // Vérifie si un skin a déjà été deviné
  skinAlreadyGuessed(skin: Skin): boolean {
    return this.skinsGuess.some(guessedSkin => guessedSkin.name === skin.name);
  }

  onFormSubmit() {
    this.formData = this.myControl.value; // Stockez la valeur du champ de saisie dans formData
    // Recherchez le Skin ayant le même nom que formData
    if (this.formData && this.skins) {
      const skinName = this.formData.toLowerCase();
      let skinGuess = this.skins.find(skin => skin.name.toLowerCase() === skinName);
      if(skinGuess){
        this.skinsGuess.push(skinGuess);
        if(this.skin===skinGuess){
          this.openVictoryDialog(skinGuess);
          this.trouver=true;
        }
      }
    }
    this.myControl.setValue('');
  }
  openVictoryDialog(skin: Skin): void {
    const dialogRef = this.dialog.open(VictoryDialogComponent, {
      width: '600px',
      data: skin
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('La pop-up de victoire a été fermée', result);
    });
  }

  correspWeapon(weapon:Weapon): string {
    if(this.skin && weapon["name"]===this.skin['weapon']["name"]){
      return 'green'
    }
    return '#ff4c4c'
  }
  correspCat(cat:Category): string {
    if(this.skin && cat['name']===this.skin['category']["name"]){
      return 'green'
    }
    return '#ff4c4c'
  }
  correspRare(rare:Rarity): string {
    if(this.skin && rare["name"]===this.skin['rarity']["name"]){
      return 'green'
    }
    return '#ff4c4c'
  }
  correspCollec(collec:Collection): string {
    if(this.skin && this.skin['collections'][0]===undefined){
      return '#ff4c4c'
    }
    if(this.skin && collec['name']===this.skin['collections'][0]['name']){
      return 'green'
    }
    return '#ff4c4c'
  }

  correspCut() {
    if(this.skin && this.skin['collections'][0]===undefined){
      return 'green'
    }
    return '#ff4c4c'


  }
}

