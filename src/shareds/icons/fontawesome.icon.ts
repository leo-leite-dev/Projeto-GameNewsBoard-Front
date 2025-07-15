import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import {
  faArrowLeft,
  faChevronLeft,
  faChevronRight,
  faExpand,
  faImage,
  faPause,
  faPen,
  faPenToSquare,
  faPlay,
  faSpinner,
  faTimes,
} from '@fortawesome/free-solid-svg-icons';

export function registerIcons(library: FaIconLibrary): void {
  library.addIcons(
    faImage,
    faSpinner,
    faPen,
    faExpand,
    faPenToSquare,
    faArrowLeft,
    faPlay,
    faPause,
    faChevronLeft,
    faChevronRight,
    faTimes
  );
}
