import { useState } from 'react'
import { createEntry } from '../../utils/api'
import MoodPicker from './MoodPicker'
import TagSelector from './TagSelector'
import { Save, Loader } from 'lucide-react'

export default function JournalForm({ onSaved }) {
  const [selectedMood, setSelectedMood] = useState(null)
  const [note, setNote] = useState('')
  const [selectedTags, setSelectedTags] = useState([])
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  const toggleTag = (tag) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    )
  }

  const handleSave = async () => {
    if (!selectedMood) {
      setError('Please select a mood first!')
      return
    }

    try {
      setSaving(true)
      setError('')
      await createEntry({
        mood_score: selectedMood.score,
        mood_label: selectedMood.label,
        note: note.trim(),
        tags: selectedTags.join(',')
      })

      setSaved(true)
      setSelectedMood(null)
      setNote('')
      setSelectedTags([])
      onSaved()

      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      setError('Failed to save entry. Try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div style={{
      background: 'var(--bg-secondary)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)',
      padding: '24px',
      display: 'flex',
      flexDirection: 'column',
      gap: '20px'
    }}>

      {/* Mood Picker */}
      <MoodPicker selected={selectedMood} onSelect={setSelectedMood} />

      {/* Journal textarea */}
      <div>
        <p style={{
          fontSize: '11px',
          fontWeight: '500',
          color: 'var(--text-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.07em',
          marginBottom: '10px'
        }}>
          Journal entry
        </p>
        <textarea
          value={note}
          onChange={e => setNote(e.target.value)}
          placeholder="How did today go? What's on your mind..."
          rows={4}
          style={{
            width: '100%',
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)',
            padding: '14px 16px',
            color: 'var(--text-primary)',
            fontSize: '14px',
            lineHeight: '1.6',
            resize: 'vertical',
            transition: 'border-color 0.15s ease'
          }}
          onFocus={e => e.target.style.borderColor = 'var(--accent)'}
          onBlur={e => e.target.style.borderColor = 'var(--border)'}
        />
      </div>

      {/* Tags */}
      <TagSelector selected={selectedTags} onToggle={toggleTag} />

      {/* Error */}
      {error && (
        <p style={{
          fontSize: '13px',
          color: 'var(--danger)',
          background: 'rgba(239,68,68,0.1)',
          padding: '10px 14px',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid rgba(239,68,68,0.2)'
        }}>
          ⚠️ {error}
        </p>
      )}

      {/* Save button */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', alignItems: 'center' }}>
        {saved && (
          <span style={{ fontSize: '13px', color: 'var(--success)' }}>
            ✅ Entry saved!
          </span>
        )}
        <button
          onClick={handleSave}
          disabled={saving || !selectedMood}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 22px',
            background: saving || !selectedMood
              ? 'var(--bg-card)'
              : 'var(--accent)',
            color: saving || !selectedMood
              ? 'var(--text-muted)'
              : '#fff',
            borderRadius: 'var(--radius-sm)',
            fontSize: '14px',
            fontWeight: '500',
            border: '1px solid var(--border)',
            cursor: saving || !selectedMood ? 'not-allowed' : 'pointer',
            transition: 'all 0.15s ease'
          }}
        >
          {saving
            ? <><Loader size={14} style={{ animation: 'spin 1s linear infinite' }} /> Saving...</>
            : <><Save size={14} /> Save entry</>
          }
        </button>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); }}`}</style>
    </div>
  )
}