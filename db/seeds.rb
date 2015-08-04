@filename = File.absolute_path('db/data/students.csv')

field_names = ['first_name', 'last_name', 'email', 'phone_num']

    puts "Importing students from '#{@filename}'"
    failure_count = 0

    Contact.transaction do
      File.open(@filename).each do |line|
        data = line.chomp.split(',')
        attribute_hash = Hash[field_names.zip(data)]
        begin
          Contact.create!(attribute_hash)
          print '.'
        rescue ActiveRecord::UnknownAttributeError
          failure_count += 1
          print '!'
        ensure
          STDOUT.flush
        end
      end
    end
    failures = failure_count > 0 ? "(failed to create #{failure_count} student records)" : ''
    puts "\nDONE #{failures}\n\n"
