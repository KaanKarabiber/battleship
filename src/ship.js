export class Ship {
  constructor(length, id = null, orientation = null, coordinates = []) {
    this.length = length;
    this.hits = 0;
    this.id = id;
    this.orientation = orientation;
    this.coordinates = coordinates;
  }
  hit() {
    this.hits += 1;
  }
  isSunk() {
    return this.hits === this.length;
  }
}
