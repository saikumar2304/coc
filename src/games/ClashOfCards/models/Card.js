export class Card {
  constructor(id, name, type, damage, healing, description, imageUrl) {
    this.id = id;
    this.name = name;
    this.type = type;
    this.damage = damage;
    this.healing = healing;
    this.description = description;
    this.imageUrl = imageUrl;
  }
}