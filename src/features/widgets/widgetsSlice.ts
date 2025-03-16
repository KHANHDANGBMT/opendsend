import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface Widget {
  id: string
  type: 'identities-provided' | 'iterable-metric' | 'yotpo-metric'
  title: string
  description: string
  position: { x: number; y: number }
  size: { width: number; height: number }
  icon?: string
  value?: string | number
}

export interface WidgetsState {
  widgets: Widget[]
}

// Define initial widget data based on the design
const initialWidgets: Widget[] = [
  {
    id: '1',
    type: 'identities-provided',
    title: 'Identities Provided',
    description: 'Number of identities your store has provided to customers',
    position: { x: 20, y: 20 },
    size: { width: 300, height: 200 },
    value: '0'
  },
  {
    id: '2',
    type: 'iterable-metric',
    title: 'Clicked',
    description: 'Number of provided identities who clicked on emails for the selected time period',
    position: { x: 20, y: 240 },
    size: { width: 300, height: 200 },
    value: '0'
  },
  {
    id: '3',
    type: 'yotpo-metric',
    title: 'Identities Provided demo',
    description: 'Number of identities your store has provided to customers',
    position: { x: 340, y: 20 },
    size: { width: 300, height: 200 },
    value: '0'
  }
]

const initialState: WidgetsState = {
  widgets: localStorage.getItem('widgets') 
    ? JSON.parse(localStorage.getItem('widgets') || '[]') 
    : initialWidgets
}

const widgetsSlice = createSlice({
  name: 'widgets',
  initialState,
  reducers: {
    updateWidgetPosition: (
      state, 
      action: PayloadAction<{ id: string; position: Widget['position'] }>
    ) => {
      const { id, position } = action.payload
      const widgetIndex = state.widgets.findIndex(w => w.id === id)
      
      if (widgetIndex !== -1) {
        state.widgets[widgetIndex].position = position
        localStorage.setItem('widgets', JSON.stringify(state.widgets))
      }
    },
    updateWidgetSize: (
      state, 
      action: PayloadAction<{ id: string; size: Widget['size'] }>
    ) => {
      const { id, size } = action.payload
      const widgetIndex = state.widgets.findIndex(w => w.id === id)
      
      if (widgetIndex !== -1) {
        state.widgets[widgetIndex].size = size
        localStorage.setItem('widgets', JSON.stringify(state.widgets))
      }
    },
    updateWidgetContent: (
      state, 
      action: PayloadAction<{ id: string; title?: string; description?: string }>
    ) => {
      const { id, title, description } = action.payload
      const widgetIndex = state.widgets.findIndex(w => w.id === id)
      
      if (widgetIndex !== -1) {
        if (title) state.widgets[widgetIndex].title = title
        if (description) state.widgets[widgetIndex].description = description
        localStorage.setItem('widgets', JSON.stringify(state.widgets))
      }
    },
    addWidget: (
      state,
      action: PayloadAction<Omit<Widget, 'id'>>
    ) => {
      const newWidget = {
        ...action.payload,
        id: Date.now().toString()
      }
      
      state.widgets.push(newWidget)
      localStorage.setItem('widgets', JSON.stringify(state.widgets))
    }
  }
})

export const { 
  updateWidgetPosition, 
  updateWidgetSize, 
  updateWidgetContent,
  addWidget
} = widgetsSlice.actions

export default widgetsSlice.reducer 