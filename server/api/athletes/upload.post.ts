export default defineEventHandler(async (event) => {
  const form = await readMultipartFormData(event)

  if (!form?.length) {
    throw createError({ statusCode: 400, statusMessage: 'No form data provided' })
  }

  const filePart = form.find(p => p.name === 'file')
  const typePart = form.find(p => p.name === 'type') // 'avatar' or 'cover'

  if (!filePart?.data || !filePart.filename) {
    throw createError({ statusCode: 400, statusMessage: 'No file provided' })
  }

  const imageType = typePart?.data.toString() || 'image'
  const ext = filePart.filename.split('.').pop() || 'jpg'
  const storagePath = `${imageType}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

  const supabase = useSupabase()

  const { data, error } = await supabase.storage
    .from('athlete-images')
    .upload(storagePath, filePart.data, {
      contentType: filePart.type || 'image/jpeg',
      upsert: false,
    })

  if (error) {
    throw createError({ statusCode: 500, statusMessage: error.message })
  }

  const { data: { publicUrl } } = supabase.storage
    .from('athlete-images')
    .getPublicUrl(data.path)

  return {
    success: true,
    url: publicUrl,
  }
})
