import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import {
  faArrowLeft, faArrowRight, faChevronLeft, faChevronRight, faCog, faExpand, faImage, faPause, faPen,
  faPenToSquare, faPlay, faPlus, faSignOutAlt, faSpinner, faTimes,
  faTrash,
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
    faTimes,
    faTrash,
    faSignOutAlt,
    faArrowLeft,
    faArrowRight,
    faPlus,
    faCog
  );
}
