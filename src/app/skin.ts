import {Category} from "./category";
import {Collection} from "./Collection";
import {Weapon} from "./weapon";
import {Rarity} from "./rarity";

export interface Skin {
  id:	string;
  name: 	string
  name_original: 	string
  description :	string

  collections : Array<Collection>

  category : Category
  weapon :	Weapon
  pattern :	string
  min_float :	number
  max_float :	number
  rarity :	Rarity
  stattrak :	boolean
  image :	string
}
