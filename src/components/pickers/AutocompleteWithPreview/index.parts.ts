import * as BUAutocomplete from "@base-ui-components/react/autocomplete"
import { Preview } from "./Preview/Preview"
import { Sentinel } from "./Sentinel/Sentinel"
import { Root } from "./Root/Root"
import { Status } from "./Status/index"

const { Root: BURoot, Status: BUStatus, ...rest } = BUAutocomplete.Autocomplete
export const AutocompleteWithPreview = { ...rest, Preview, Sentinel, Root, Status }
