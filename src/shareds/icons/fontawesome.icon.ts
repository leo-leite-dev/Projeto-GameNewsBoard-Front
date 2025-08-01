import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import {
  faArrowLeft, faArrowRight, faChevronLeft, faChevronRight, faCog, faExpand, faEye, faGamepad, faImage, faInfoCircle, faPause, faPen,
  faPenToSquare, faPlay, faPlus, faRankingStar, faSearch, faSignOutAlt, faSliders, faSpinner, faTimes,
  faTrash,
  faUser,
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
    faUser,
    faTrash,
    faSignOutAlt,
    faArrowLeft,
    faArrowRight,
    faPlus,
    faCog,
    faEye,
    faInfoCircle,
    faSearch,
    faSliders,
    faRankingStar,
    faGamepad
  );
}
