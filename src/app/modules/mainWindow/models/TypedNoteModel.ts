import { each, groupBy } from 'lodash';
import { NoteType, NoteViewModel } from './NoteModel';

export class TypedNoteModel {
  public type: NoteType;
  public notes: NoteViewModel[];

  public static getAllNotes(typedNotes: TypedNoteModel[]): NoteViewModel[] {
    let notes: NoteViewModel[] = [];
    typedNotes.forEach(typedNote => {
      notes = notes.concat(typedNote.notes);
    });
    return notes;
  }

  public static groupNotesByType(notes: NoteViewModel[]): TypedNoteModel[] {
    const typedNotes: TypedNoteModel[] = [];
    const groupedNotes = groupBy(notes, 'noteType') as unknown as NoteViewModel[];
    // @ts-ignore
    each(groupedNotes, (notesList: NoteViewModel[]) => {
      const typedNote: TypedNoteModel = new TypedNoteModel();
      typedNote.notes = notesList;
      typedNote.type = notesList[0].noteType;
      typedNotes.push(typedNote);
    });
    return typedNotes;
  }

  public static addNoteToTypedNotes(note: NoteViewModel, typedNotes: TypedNoteModel[]): void {
    const typedNote = this.getTypedNotes(note.noteType, typedNotes);
    if (!typedNote) {
      typedNotes.push(this.getTypedNoteFromNote(note));
    }
  }

  public static updateNoteToTypedNotes(note: NoteViewModel, typedNotes: TypedNoteModel[]): void {
    const typedNote = this.getTypedNotes(note.noteType, typedNotes);
    if (typedNote) {
      const noteIndex = this.getNoteIndex(note.id, typedNote);
      if (noteIndex || noteIndex === 0) {
        typedNote.notes[noteIndex] = note;
      }
    } else {
      typedNotes.push(this.getTypedNoteFromNote(note));
    }
  }

  public static deleteNoteFromTypedNotes(deletedNote: NoteViewModel, typedNotes: TypedNoteModel[]): void {
    const typedNote = this.getTypedNotes(deletedNote.noteType, typedNotes);
    if (typedNote) {
      typedNote.notes = typedNote.notes.filter((note) => note.id !== deletedNote.id);
    }
  }

  private static getTypedNoteFromNote(note: NoteViewModel): TypedNoteModel {
    const newTypedNotes = new TypedNoteModel();
    newTypedNotes.type = note.noteType;
    newTypedNotes.notes = [note];
    return newTypedNotes;
  }

  private static getTypedNotes(type: NoteType, typedNotes: TypedNoteModel[]): TypedNoteModel {
    return typedNotes.find((typedNote) => type === typedNote.type);
  }

  private static getNoteIndex(id: string, typedNote: TypedNoteModel): number {
    return typedNote.notes.findIndex((typedNote) => id === typedNote.id)
  }
}
